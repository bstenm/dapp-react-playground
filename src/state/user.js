
import { buy } from '../services/TokenSaleContract';
import * as ms from '../config/messages';
import { execEffect } from '../libs/execEffect';
import { getUserBalance, approveProxy } from '../services/TokenContract';
import {
      addVoteFor,
      getUserData,
      registerUser,
      getContractAddress,
} from '../services/UsersContract';

export default {
      state: { tokens: 0, votingRecord: {} },
      reducers: {
            setUserData(state, payload) {
                  return { ...state, ...payload };
            },

            updateTokenCount(state, payload) {
                  const tokens = state.tokens + parseInt(payload, 10);
                  return { ...state, tokens };
            },

            updateVotingRecord(state, name) {
                  // [TODO]: use immer
                  const votingRecord = state.votingRecord;
                  const nbOfVotes = votingRecord[name] || 0;
                  const newRecord = { ...votingRecord, [name]: 1 + nbOfVotes };
                  return { ...state, votingRecord: newRecord };
            },

            logout() {
                  return {};
            },
      },
      effects: dispatch => ({
            async login(address) {
                  execEffect(dispatch)(
                        async () => {
                              const { setUserData } = dispatch.user;
                              const {
                                    votingRecord,
                                    userAddress,
                              } = await getUserData(address);
                              const registered = !!userAddress;
                              if (!registered) {
                                    await registerUser(address);
                              }
                              const tokens = registered
                                    ? await getUserBalance(address)
                                    : 0;
                              setUserData({ tokens, votingRecord, address });
                        },
                        () => dispatch.alert.error(ms.loginFailure),
                  );
            },

            async buyTokens(
                  val,
                  {
                        user: { address, tokens },
                  },
            ) {
                  execEffect(dispatch)(
                        async () => {
                              const nb = parseInt(val, 10) + tokens;
                              await buy(address, val);
                              const contractAddress = await getContractAddress();
                              // allow users contract to transfer tokens on user behalf
                              await approveProxy(address, contractAddress, nb);
                              this.updateTokenCount(val);
                        },
                        () => dispatch.alert.error(ms.buyTokensFailure),
                  );
            },

            async addVoteToRecord(
                  name,
                  {
                        user: { address },
                  },
            ) {
                  execEffect(dispatch)(
                        async () => {
                              await addVoteFor(name, address);
                              this.updateVotingRecord(name);
                              this.updateTokenCount(-1);
                        },
                        () => dispatch.alert.error(ms.unexpectedError),
                  );
            },
      }),
};
