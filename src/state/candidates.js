import ms from '../config/messages';
import cf from '../config';
import Log from '../services/Log';
import web3 from '../services/Web3';
import uniqBy from 'lodash/uniqBy';
import Contracts from '../services/ContractsInstances';
import {dispatch} from '@rematch/core';
import {execEffect} from '../libs/execEffect';
import {uploadToIpfs} from '../libs/ipfsLib';

export default {
      state: cf.candidates.map(e => ({name: e, vote: '0'})),
      reducers: {
            updateList( state, payload ) {
                  return payload;
            }
      },
      effects: {
            async addInfo (payload, { user: { address }}) {
                  execEffect(async () => {
                        const from = address;
                        const  contract = await Contracts.Candidates.deployed();
                        const { candidate, description, file } = payload;
                        if (! file)  return contract.addInfo(candidate, description, null, { from });
                        const ipfsHash = await uploadToIpfs(file);
                        await contract.addInfo(candidate, description, ipfsHash, { from, gas: 100000 });
                  }, () => dispatch.alert.error(ms.notSaved));
            },

            async getVotes (payload, {candidates}) {
                  execEffect(async () => {
                        const updated = [];
                        const  ctVoting = await Contracts.Voting.deployed();
                        await Promise.all (candidates.map( async ({name}) => {
                              const vote = await ctVoting.totalVotesFor(name);
                              updated.push({name, vote: vote.toString()});
                        }));
                        this.updateList(updated);
                  }, () => dispatch.alert.error(ms.retrieveVotesFailure));
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