import Log from '../services/Log';
import user from './user';
import {init} from '@rematch/core';
import alert from './alert';
import web3 from '../services/Web3';
import * as ms from '../config/messages';
import loading from './loading';
import * as TokenContract from '../services/TokenContract';
import * as VotingContract from '../services/VotingContract';
import * as TokenSaleContract from '../services/TokenSaleContract';

const initialState = {};

const store = init({ models: { loading, alert, user }});
const {dispatch} = store;

const {buy} = TokenSaleContract;
const {getUserBalance} = TokenContract;
const {getUserData, getVotingContractAddress} = VotingContract;

jest.mock('../services/Log');
jest.mock('../services/TokenContract.js');
jest.mock('../services/VotingContract.js');
jest.mock('../services/TokenSaleContract.js');

describe('(Sagas) user', () => {

      beforeEach(() => {
            jest.spyOn(Log, 'error');
            getUserBalance.mockImplementation(() =>  100);
            getVotingContractAddress.mockImplementation(() => '0xContractAddress');
            getUserData.mockImplementation(() => ({
                  user: 'Joanna',
                  address: '0XUserAddress',
                  votingRecord: { Hilary: '4'}
            }));
      });

      afterEach(async () => {
            buy.mockReset();
            Log.error.mockReset();
            getUserData.mockReset();
            getUserBalance.mockReset();
            getVotingContractAddress.mockReset();
      });

      describe('login', () => {

            it('Dispatches an alert when error thrown', (done) => {
                  getUserData.mockImplementation(() => {
                        throw new Error('getUserData error');
                  });
                  dispatch.user.login('Joanna');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().user).toEqual({});
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.noAddressAvailable
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual('getUserData error');
                        done();
                  }, 1);
            });

            it('Sets the user data into the state', (done) => {
                  dispatch.user.login('Joanna');
                  setTimeout(() => {
                        const {user} = store.getState();
                        expect(user.name).toEqual('Joanna');
                        expect(user.tokens).toEqual(100);
                        expect(user.address).toEqual('0XUserAddress');
                        expect(user.votingRecord).toEqual({Hilary: '4'});
                        done();
                  }, 1);
            });
      });

      describe('buyTokens', () => {

            it('Dispatches an alert when error thrown', async (done) => {
                  buy.mockImplementationOnce(() =>  {
                        throw new Error('buy error');
                  });
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.buyTokensFailure
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual('buy error');
                        done();
                  }, 1);
            });

            it('Updates the user tokens nb in state', async (done) => {
                  // getUserBalance.mockImplementation(() =>  90);
                  const buyTokensSpy = jest.fn();
                  buy.mockImplementation(() => buyTokensSpy);
                  // log theuser in first
                  await dispatch.user.login('Joanna');
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        expect(store.getState().user.tokens).toEqual(102);
                        done();
                  }, 1);
            });
      });
});
