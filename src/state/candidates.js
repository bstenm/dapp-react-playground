import ms from '../config/messages';
import cf from '../config';
import Log from '../services/Log';
import web3 from '../services/Web3';
import uniqBy from 'lodash/uniqBy';
import history from '../history';
import Contracts from '../services/ContractsInstances';
import {produce} from 'immer';
import {dispatch} from '../store';
import {execEffect} from '../libs/execEffect';
import {uploadToIpfs} from '../libs/ipfsLib';

export default {
      state: cf.candidates.map(e => ({ name: e, vote: '0', info: [] })),

      // selectors: (slice, _, hasProps) => ({
      //       getInfoFor: hasProps((_, candidate) => slice(items => {
      //             const e = items.find(e => e.name === candidate);
      //             return e && e.info;
      //       }))
      // }),


      selectors: {
            getInfoFor: () => ({ candidates }) => candidate => {
                  const e = candidates.find(e => e.name === candidate);
                  return e ? e.info : [];
            }
      },

      reducers: {

            updateList( state, payload ) {
                  return payload;
            },

            updateInfo: (state, { candidate, info }) => {
                  return produce(state, draft => {
                        const idx = draft.findIndex(e => e.name === candidate);
                        draft[idx].info.push(info);
                  });
            }
      },
      effects: {

            async fetchInfo (candidate) {
                  execEffect(async () => {
                        const  contract = await Contracts.Candidates.deployed();
                        const data = await contract.getInfo(candidate);
                        const [ title, description, attachment ] = data.map(e => web3.toUtf8(e));
                        const info = { title, description, attachment };
                        dispatch.candidates.updateInfo({ candidate, info });
                  }, () => dispatch.alert.error(ms.retrieveDataFailure));
            },

            async addInfo (payload, { user: { address }}) {
                  execEffect(async () => {
                        let ipfsHash = null;
                        const gas = 200000;
                        const from = address;
                        const  contract = await Contracts.Candidates.deployed();
                        const { candidate, title, description, file } = payload;
                        if (file) ipfsHash = await uploadToIpfs(file);
                        await contract.addInfo(candidate, title, description, ipfsHash, { from, gas });
                        history.push(cf.routes.voting);
                  }, () => dispatch.alert.error(ms.notSaved));
            },

            async fetchVotes (payload, {candidates}) {
                  execEffect(async () => {
                        const updated = [];
                        const  ctVoting = await Contracts.Voting.deployed();
                        await Promise.all (candidates.map( async ({name}) => {
                              const vote = await ctVoting.totalVotesFor(name);
                              updated.push({name, vote: vote.toString()});
                        }));
                        this.updateList(updated);
                  }, () => dispatch.alert.error(ms.retrieveDataFailure));
            },

            async addVote (candidate, {candidates, loading, user: {name, address}}) {
                  execEffect(async () => {
                        const gas = 200000;
                        const from = address;
                        let updated = [...candidates];
                        const ctVoting = await Contracts.Voting.deployed();
                        await ctVoting.voteForCandidate(candidate, name, {from, gas});
                        const vote = await ctVoting.totalVotesFor(candidate);
                        updated.unshift({name: candidate, vote: vote.toString()});
                        this.updateList(uniqBy(updated, 'name'));
                  }, () => dispatch.alert.error(ms.notEnoughFunds));
            }
      }
}