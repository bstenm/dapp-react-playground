import Log from '../services/Log';
import user from './user';
import {init} from '@rematch/core';
import alert from './alert';
import web3 from '../services/Web3';
import * as ms from '../config/messages';
import loading from './loading';
import * as UsersContract from '../services/UsersContract';
import * as TokenContract from '../services/TokenContract';
import * as TokenSaleContract from '../services/TokenSaleContract';

const initialState = {};

const store = init({ models: { loading, alert, user }});
const {dispatch} = store;

const {buy} = TokenSaleContract;
const {getUserBalance, approveProxy} = TokenContract;
const {getUserData, registerUser, getContractAddress} = UsersContract;

jest.mock('../services/Log');
jest.mock('../services/TokenContract.js');
jest.mock('../services/UsersContract.js');
jest.mock('../services/TokenSaleContract.js');

describe('(Sagas) user', () => {
      let userData = {
            userAddress: '0XUserAddress',
            votingRecord: { Hilary: '4'}
      };

      beforeEach(() => {
            jest.spyOn(Log, 'error');
      });

      afterEach(async () => {
            buy.mockReset();
            Log.error.mockReset();
            registerUser.mockReset();
            getUserData.mockReset();
            approveProxy.mockReset();
            getUserBalance.mockReset();
            getContractAddress.mockReset();
      });

      describe('login', () => {

            afterEach(async () => {
                  await dispatch.user.logout()
            });

            it('Dispatches an alert when error thrown', (done) => {
                  getUserData.mockImplementation(() => {throw new Error('error')});
                  dispatch.user.login('0xUserAddress');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().user).toEqual({});
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.loginFailure
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual('error');
                        done();
                  }, 1);
            });

            it('Sets the user data into the state', async (done) => {
                  getUserBalance.mockImplementation(() =>  100);
                  getUserData.mockImplementation(() => userData);
                  await dispatch.user.login('0XUserAddress');
                  setTimeout(() => {
                        const {user} = store.getState();
                        expect(user.tokens).toEqual(100);
                        expect(user.address).toEqual('0XUserAddress');
                        expect(user.votingRecord).toEqual({Hilary: '4'});
                        done();
                  }, 1);
            });

            it('Regiters the user if not found on the blockchain', async (done) => {
                  getUserData.mockImplementation(() => ({}));
                  await dispatch.user.login('0XNewUserAddress');
                  setTimeout(() => {
                        const {user} = store.getState();
                        expect(registerUser.mock.calls[0][0]).toEqual('0XNewUserAddress');
                        expect(user.tokens).toEqual(0);
                        expect(user.address).toEqual('0XNewUserAddress');
                        expect(user.votingRecord).toEqual(undefined);
                        done();
                  }, 1);
            });
      });

      describe('buyTokens', () => {

            beforeEach(async () => {
                  getUserData.mockImplementation(() => userData);
                  getUserBalance.mockImplementation(() =>  90);
                  // log the user in first
                  await dispatch.user.login('0xUserAddress');
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  buy.mockImplementation(() =>  {throw new Error('error')});
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.buyTokensFailure
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual('error');
                        done();
                  }, 1);
            });

            it('Updates the user tokens nb in state', async (done) => {
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        expect(store.getState().user.tokens).toEqual(92);
                        done();
                  }, 1);
            });

            it('Approves the Users contract to transfer those tokens on the user\'s behalf', async (done) => {
                  getContractAddress.mockImplementation(() =>  '0xContractAddress');
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        expect(approveProxy.mock.calls.length).toEqual(1);
                        expect(approveProxy.mock.calls[0][0]).toEqual('0xUserAddress');
                        expect(approveProxy.mock.calls[0][1]).toEqual('0xContractAddress');
                        expect(approveProxy.mock.calls[0][2]).toEqual(92);
                        done();
                  }, 1);
            });
      });
});
