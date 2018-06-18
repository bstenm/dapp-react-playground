import {dispatch} from '@rematch/core';
import VotingService from '../services/Voting';

export default {
      state: {},
      reducers: {
            updateUserDetails (state, payload) {
                  return {...state, ...payload };
            },

            updateTokenCount (state, payload) {
                  const tokens = state.tokens + parseInt(payload, 10);
                  return {...state, tokens};
            },

            addVoteToRecord(state, payload) {
                  const {name, vote} = payload;
                  const {votingRecord} = state;
                  const nbOfVotes = votingRecord[name] || 0;
                  const newRecord = {...votingRecord, [name]: vote + nbOfVotes};
                  return {...state, votingRecord: newRecord};
            }
      },
      effects: {
            async login (name, {candidates}) {
                  try {
                        const {tokens, record, address} = await VotingService.login(name);
                        const votingRecord = candidates.reduce((r, v, k) => {
                              r[v.name] = record[k];
                              return r;
                        }, {});
                        this.updateUserDetails({tokens, votingRecord, name, address});
                  } catch (e) {
                        console.error(e.message);
                        dispatch.alert.message('Could not register the new user');
                  }
            },

            async buyTokens (nb, {user: {name, address}}) {
                  try {
                        await VotingService.buyTokens(nb, {name, address});
                        this.updateTokenCount(nb);
                  } catch(e) {
                        console.error(e.message);
                        dispatch.alert.message('Could not transfer the tokens to your  account');
                  }
            }
      }
};