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
            async login (name, roostState) {
                  try {
                        const address = await VotingService.login(name);
                        this.updateUserDetails({tokens: 0, name, address, votingRecord: {}});
                  } catch (e) {
                        console.error(e.message);
                        dispatch.alert.message('Could not register the new user');
                  }
            },

            // [TEMP]:
            // async getDetails (name, roostState) {
            //       try {
            //             this.updateUserDetails({name, id, tokens, votingRecord});
            //       } catch(e) {
            //             console.error(e.message);
            //             dispatch.alert.message('Could not retrieve the user account');
            //       }
            // },

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