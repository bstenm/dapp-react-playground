import cf from '../config';
import Log from '../services/Log';
import web3 from '../services/Web3';
import * as ms from '../config/messages';
import Contracts from '../services/ContractsInstances';
import {dispatch} from '../store';
import difference from 'lodash/difference';

const {accounts} = web3.eth;

export default {
      state: {},
      reducers: {
            updateUserDetails (state, payload) {
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
      effects: {
            async register (name) {
                  try {
                        const {updateUserDetails} = dispatch.user;
                        const ctVoting = await Contracts.Voting.deployed();
                        const addresses = await ctVoting.getVoterAddresses();
                        const availableAddresses = difference(accounts, addresses);
                        // 1 because first index (0) is for admin
                        const address = availableAddresses[1];
                        if (! address) {
                              throw new Error(ms.noMoreRegistrationAllowed); // THROW
                        }
                        const nameInHex = web3.fromUtf8(name);
                        await ctVoting.registerVoter(nameInHex, {from: address, gas: 150000});
                        updateUserDetails({tokens: 0, votingRecord: {}, name, address});
                  } catch (e) {
                        Log.error(e.message);
                        dispatch.alert.error(e.message);
                  }
            },

            async login (name) {
                  try {
                        const { updateUserDetails } = dispatch.user;
                        const  ctToken = await Contracts.Token.deployed();
                        const  ctVoting = await Contracts.Voting.deployed();
                        let [ record, address, user ] =  await ctVoting.voterDetails(name);
                        const registered = web3.toUtf8(user) === name;
                        if (! registered) { return this.register(name); }  // EXIT
                        const tokens = (await ctToken.balanceOf(address)).toNumber();
                        record = cf.candidates.reduce((r, v, k) => {
                              r[v] = record[k].toNumber();
                              return r;
                        }, {});
                        updateUserDetails({tokens, votingRecord: record, name, address});
                  } catch (e) {
                        Log.error(e.message);
                        dispatch.alert.error(ms.noMoreRegistrationAllowed);
                  }
            },

            async buyTokens (val, {user: {name, address, tokens}}) {
                  try {
                        const nb = parseInt(val, 10) + (tokens || 0);
                        const ctToken = await Contracts.Token.deployed();
                        const ctVoting = await Contracts.Voting.deployed();
                        const ctTokenSale = await Contracts.TokenSale.deployed();
                        // value of tokens in wei
                        const value = web3.toWei('1', 'ether') * val;
                        await ctTokenSale.buy(val, {from: address, value});
                        // allow voting contract to transfer tokens on user behalf
                        await ctToken.approve(ctVoting.address, nb, {from: address});
                        this.updateTokenCount(val);
                  } catch(e) {
                        Log.error(e.message);
                        dispatch.alert.error(ms.buyTokensFailure);
                  }
            }
      }
};