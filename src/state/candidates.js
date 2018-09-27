import cf from '../config';
import Log from '../services/Log';
import web3 from '../services/Web3';
import uniqBy from 'lodash/uniqBy';
import history from '../history';
import * as ms from '../config/messages';
import Contracts from '../services/ContractsInstances';
import {produce} from 'immer';
import {execEffect} from '../libs/execEffect';
import {uploadToIpfs} from '../libs/ipfsLib';

export default {
      name: 'candidates',
      state: cf.candidates.map(e => ({ name: e, vote: '0', info: [] })),

      selectors: {
            // total() {
            //       return candidate => (rootState, props) => console.log(rootState)
            // }

            getInfoFor: () => ({ candidates }) => candidate => {
                  const e = candidates.find(e => e.name === candidate);
                  return e ? e.info : [];
            }
      },

      reducers: {

            updateList( state, data ) {
                  return state.map( e => {
                        const src = data.find(k => k.name === e.name);
                        return Object.assign({}, e, src);
                  });
            },

            updateInfo: (state, { name, info }) => {
                  return produce(state, draft => {
                        const i = draft.findIndex(e => e.name === name);
                        draft[i].info = draft[i].info = info;
                  });
            }
      },
      effects: dispatch => ({

            async fetchInfo (name, { candidates }) {
                  execEffect(dispatch)(async () => {
                        let i = 0, raw, data, info = [];
                        const  contract = await Contracts.Candidates.deployed();
                        // [TEMP]: until solidity functions can return nested arrays
                        do {
                              raw = await contract.getInfo(name, i++);
                              data = raw.map(e => web3.toUtf8(e));
                              const [ title, description, fileHash ] = data;
                              if (title) info.push({ title, description, fileHash });
                        } while (!! data[0]); // data[0] is title
                        dispatch.candidates.updateInfo({ name, info });
                  }, () => dispatch.alert.error(ms.retrieveDataFailure));
            },

            async addInfo (payload, { user: { address }}) {
                  execEffect(dispatch)(async () => {
                        let ipfsHash = null;
                        const gas = 500000;
                        const from = address;
                        const  { addInfo } = await Contracts.Candidates.deployed();
                        const { candidate, title, description, file } = payload;
                        if (file) ipfsHash = await uploadToIpfs(file);
                        await addInfo(candidate, title, description, ipfsHash, { from, gas });
                        history.push(cf.routes.voting);
                  }, () => dispatch.alert.error(ms.notSaved));
            },

            async fetchVotes (payload, {candidates}) {
                  execEffect(dispatch)(async () => {
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
                  execEffect(dispatch)(async () => {
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
      })
}