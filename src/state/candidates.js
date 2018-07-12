import ms from '../config/messages';
import cf from '../config';
import Log from '../services/Log';
import web3 from '../services/Web3';
import uniqBy from 'lodash/uniqBy';
import {dispatch} from '@rematch/core';
import Contracts from '../services/ContractsInstances';


export default {
      state: cf.candidates.map(e => ({name: e, vote: '0'})),
      reducers: {
            updateList( state, payload ) {
                  return payload;
            }
      },
      effects: {
            async getVotes (payload, {candidates}) {
                  try {
                        const updated = [];
                        const  ctVoting = await Contracts.Voting.deployed();
                        await Promise.all (candidates.map( async ({name}) => {
                              const vote = await ctVoting.totalVotesFor(name);
                              updated.push({name, vote: vote.toString()});
                        }));
                        this.updateList(updated);
                  } catch(e) {
                        Log.error(e.message);
                        dispatch.alert.message(ms.retrieveVotesFailure);
                  }
            },

            async addVote (candidate, {candidates, requesting, user: {name, address}}) {
                  try {
                        dispatch.requesting.start();
                        let updated = [...candidates];
                        const ctVoting = await Contracts.Voting.deployed();
                        await ctVoting.voteForCandidate(
                              web3.fromUtf8(candidate),
                              web3.fromUtf8(name),
                              {from: address, gas: 200000}
                        );
                        const vote = await ctVoting.totalVotesFor(candidate);
                        updated.unshift({name: candidate, vote: vote.toString()});
                        this.updateList(uniqBy(updated, 'name'));
                  } catch (e) {
                        Log.error(e.message);
                        dispatch.alert.message(ms.notEnoughFunds);
                  } finally {
                        dispatch.requesting.stop();
                  }
            }
      }
}