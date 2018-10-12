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
const {getUserData, getVotingContractAddress, registerUser, getNewAddress} = VotingContract;

jest.mock('../services/Log');
jest.mock('../services/TokenContract.js');
jest.mock('../services/VotingContract.js');
jest.mock('../services/TokenSaleContract.js');

describe('(Sagas) user', () => {
      let userData = {
            user: 'Joanna',
            address: '0XUserAddress',
            votingRecord: { Hilary: '4'}
      };

      beforeEach(() => {
            jest.spyOn(Log, 'error');
            getVotingContractAddress.mockImplementation(() => '0xContractAddress');
      });

      afterEach(async () => {
            buy.mockReset();
            Log.error.mockReset();
            registerUser.mockReset();
            getNewAddress.mockReset();
            getUserData.mockReset();
            getUserBalance.mockReset();
            getVotingContractAddress.mockReset();
      });

      describe('login', () => {

            afterEach(async () => {
                  await dispatch.user.logout()
            });

            it('Dispatches an alert when error thrown', (done) => {
                  getUserData.mockImplementation(() => {throw new Error('error')});
                  dispatch.user.login('Joanna');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().user).toEqual({});
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.noAddressAvailable
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual('error');
                        done();
                  }, 1);
            });

            it('Sets the user data into the state', async (done) => {
                  getUserBalance.mockImplementation(() =>  100);
                  getUserData.mockImplementation(() => userData);
                  await dispatch.user.login('Joanna');
                  setTimeout(() => {
                        const {user} = store.getState();
                        expect(user.name).toEqual('Joanna');
                        expect(user.tokens).toEqual(100);
                        expect(user.address).toEqual('0XUserAddress');
                        expect(user.votingRecord).toEqual({Hilary: '4'});
                        done();
                  }, 1);
            });

            it('Regiters the user if not found on the blockchain', async (done) => {
                  const registerSpy = jest.spyOn(dispatch.user, 'register');
                  getUserBalance.mockImplementation(() =>  100);
                  getUserData.mockImplementation(() => userData);
                  await dispatch.user.login('Jenni');
                  setTimeout(() => {
                        // the login fn should not set the user into the state
                        expect(store.getState().user).toEqual({});
                        expect(registerSpy.mock.calls.length).toEqual(1);
                        expect(registerSpy.mock.calls[0][0]).toEqual('Jenni');
                        registerSpy.mockRestore();
                        done();
                  }, 1);
            });
      });

      describe('register', () => {

            afterEach(async () => {
                  await dispatch.user.logout()
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  registerUser.mockImplementation(() => {throw new Error('error')});
                  getNewAddress.mockImplementation(() => '0x1');
                  await dispatch.user.register('Joanna');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().user).toEqual({});
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: 'error'
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual('error');
                        done();
                  }, 1);
            });

            it('Dispatches an alert when no new address returned', async (done) => {
                  getNewAddress.mockImplementation(() => null);
                  await dispatch.user.register('Joanna');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().user).toEqual({});
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.noAddressAvailable
                        });
                        expect(logErrorCalls.length).toEqual(1);
                        expect(logErrorCalls[0][0].message).toEqual(ms.noAddressAvailable);
                        done();
                  }, 1);
            });

            it('Registers the new user on the blockchain and sets her data into the state', async (done) => {
                  getNewAddress.mockImplementation(() => '0xNewAddress');
                  await dispatch.user.register('Joanna');
                  setTimeout(() => {
                        const {user} = store.getState();
                        expect(registerUser.mock.calls.length).toEqual(1);
                        expect(registerUser.mock.calls[0][0] ).toEqual('Joanna', '0xNewAddress');
                        expect(user.name).toEqual('Joanna');
                        expect(user.tokens).toEqual(0);
                        expect(user.address).toEqual('0xNewAddress');
                        expect(user.votingRecord).toEqual({});
                        done();
                  }, 1);
            });
      });

      describe('buyTokens', () => {

            it('Dispatches an alert when error thrown', async (done) => {
                  getUserData.mockImplementation(() => userData);
                  getUserBalance.mockImplementation(() =>  90);
                  // log the user in first
                  await dispatch.user.login('Joanna');
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
                  getUserData.mockImplementation(() => userData);
                  getUserBalance.mockImplementation(() =>  90);
                  // log the user in first
                  await dispatch.user.login('Joanna');
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        expect(store.getState().user.tokens).toEqual(92);
                        done();
                  }, 1);
            });
      });
});
