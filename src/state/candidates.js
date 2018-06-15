import cf from '../config';
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
                              const vote = await VotingService.totalVotesFor(name)
                              updated.push({name, vote})
                        }));
                        this.updateList(updated);
                  } catch(e) {
                        console.error(e.message);
                        dispatch.alert.message('Could not retrieve the vote data')
                  }
            },

            async addVote (name, {candidates, requesting, user}) {
                  try {
                        dispatch.requesting.start();
                        let updated = [...candidates];
                        await VotingService.voteFor(name, {name: user.name, address: user.address});
                        const vote = await VotingService.totalVotesFor(name);
                        updated.unshift({name, vote});
                        this.updateList(uniqBy(updated, 'name'));
                  } catch (e) {
                        console.error(e.message);
                        dispatch.alert.message('Please make sure you have enough funds to vote');
                  } finally {
                        dispatch.requesting.stop();
                  }
            }
      }
}