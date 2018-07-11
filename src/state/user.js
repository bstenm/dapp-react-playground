import ms from '../config/messages';
import Log from '../services/Log';
import web3 from '../services/Web3';
import {token} from '../config/index';
import Contracts from '../services/ContractsInstances';
import {dispatch} from '@rematch/core';
import VotingService from '../services/Voting';

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

            addVoteToRecord (state, payload) {
                  const {name, vote} = payload;
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
            async login (name, {candidates}) {
                  try {
                        const {tokens, record, address} = await VotingService.login(name);
                        const votingRecord = candidates.reduce((r, v, k) => {
                              r[v.name] = record[k];
                              return r;
                        }, {});
                        dispatch.user.updateUserDetails({tokens, votingRecord, name, address});
                  } catch (e) {
                        Log.error(e.message);
                        dispatch.alert.message(ms.noMoreRegistrationAllowed);
                  }
            },

            async buyTokens (val, {user: {name, address, tokens}}) {
                  try {
                        const nb = parseInt(val, 10) + (tokens || 0);
                        const ctToken = await Contracts.Token.deployed();
                        const ctVoting = await Contracts.Voting.deployed();
                        const ctTokenSale = await Contracts.TokenSale.deployed();
                        // value of tokens in wei
                        const value = web3.toWei('0.000000001', 'ether') * val;
                        await ctTokenSale.buy(val, {from: address, value});
                        // allow voting contract to transfer tokens on user behalf
                        await ctToken.approve(ctVoting.address, nb, {from: address});
                        this.updateTokenCount(val);
                  } catch(e) {
                        Log.error(e.message);
                        dispatch.alert.message(ms.buyTokensFailure);
                  }
            }
      }
};