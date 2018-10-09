import {buy} from '../services/TokenSaleContract';
import * as ms from '../config/messages';
import {execEffect} from '../libs/execEffect';
import {getUserBalance, approveProxy} from '../services/TokenContract';
// [TOREMOVE]: won't need getVotingContractAddress when Solidity contract takes care of setting the proxy approval
import {getUserData, getVotingContractAddress, getNewAddress, registerUser} from '../services/VotingContract';

export default {
      state: {},
      reducers: {
            setUserData (state, payload) {
                  return {...state, ...payload };
            },

            updateTokenCount (state, payload) {
                  const tokens = (state.tokens || 0) + parseInt(payload, 10);
                  return {...state, tokens};
            },

            addVoteToRecord (state, {name, vote}) {
                  // [TODO]: use immer
                  const {votingRecord} = state;
                  const nbOfVotes = votingRecord[name] || 0;
                  const newRecord = {...votingRecord, [name]: vote + nbOfVotes};
                  return {...state, votingRecord: newRecord};
            },

            logout () {
                  return {};
            }
      },
      effects: (dispatch) => ({

            async register (name) {
                  execEffect(dispatch)(async () => {
                        const {setUserData} = dispatch.user;
                        const address = await getNewAddress();
                        if (! address) { throw new Error(ms.noAddressAvailable) }
                        await registerUser(name, address);
                        setUserData({tokens: 0, votingRecord: {}, name, address});
                  }, e => dispatch.alert.error(e.message));
            },

            async login (name) {
                  execEffect(dispatch)(async () => {
                        const {setUserData} = dispatch.user;
                        const {votingRecord, address, user} =  await getUserData(name);
                        const registered = (user === name);
                        if (! registered) { return this.register(name); }  // * exit *
                        const tokens = await getUserBalance(address);
                        setUserData({tokens, votingRecord, name, address});
                  }, () => dispatch.alert.error(ms.noAddressAvailable));
            },

            async buyTokens (val, { user: { name, address, tokens }}) {
                  execEffect(dispatch)(async () => {
                        const nb = parseInt(val, 10) + (tokens || 0);
                        await buy(address, val);
                        // [TOREMOVE]: won't need it when Solidity contract takes care of setting the proxy approval
                        const votingContractAddress = await getVotingContractAddress();
                        // allow voting contract to transfer tokens on user behalf
                        await approveProxy(address, votingContractAddress, nb);
                  }, () => dispatch.alert.error(ms.buyTokensFailure));
            }
      })
};