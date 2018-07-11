import ms from '../config/messages';
import cf from '../config';
import Log from '../services/Log';
import uniqBy from 'lodash/uniqBy';
import {dispatch} from '@rematch/core';
import VotingService from '../services/Voting';

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
                        await Promise.all (candidates.map( async ({name}) => {
                              const vote = await VotingService.totalVotesFor(name);
                              updated.push({name, vote});
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
                        await VotingService.voteFor(candidate, {name, address});
                        const vote = await VotingService.totalVotesFor(candidate);
                        updated.unshift({name: candidate, vote});
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