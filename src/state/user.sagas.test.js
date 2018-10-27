
import { init } from '@rematch/core';
import Log from '../services/Log';
import user from './user';
import alert from './alert';
import * as ms from '../config/messages';
import loading from './loading';
import * as UsersContract from '../services/UsersContract';
import * as TokenContract from '../services/TokenContract';
import * as TokenSaleContract from '../services/TokenSaleContract';

const initialState = { tokens: 0, votingRecord: {} };

const store = init({ models: { loading, alert, user } });
const { dispatch } = store;

const { buy } = TokenSaleContract;
const { getUserBalance, approveProxy } = TokenContract;
const {
      getUserData,
      registerUser,
      getContractAddress,
      addVoteFor,
} = UsersContract;

jest.mock('../services/Log');
jest.mock('../services/TokenContract.js');
jest.mock('../services/UsersContract.js');
jest.mock('../services/TokenSaleContract.js');

describe('(Sagas) user', () => {
      const userData = {
            userAddress: '0XUserAddress',
            votingRecord: { Candidate1: 4 },
            tokens: 2,
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
                  await dispatch.user.logout();
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  getUserData.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.user.login('0xUserAddress');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().user).toEqual(initialState);
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.loginFailure,
                        });
                        expect(logErrorCalls).toHaveLength(1);
                        expect(logErrorCalls[0][0].message).toEqual('error');
                        done();
                  }, 1);
            });

            it('Sets the user data into the state', async (done) => {
                  getUserBalance.mockImplementation(() => 100);
                  getUserData.mockImplementation(() => userData);
                  await dispatch.user.login('0XUserAddress');
                  setTimeout(() => {
                        const { user: userState } = store.getState();
                        expect(userState.tokens).toEqual(100);
                        expect(userState.address).toEqual('0XUserAddress');
                        expect(userState.votingRecord).toEqual({ Candidate1: 4 });
                        done();
                  }, 1);
            });

            it('Regiters the user if not found on the blockchain', async (done) => {
                  getUserData.mockImplementation(() => ({}));
                  await dispatch.user.login('0XNewUserAddress');
                  setTimeout(() => {
                        const { user } = store.getState();
                        expect(registerUser.mock.calls[0][0]).toEqual(
                              '0XNewUserAddress',
                        );
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
                  getUserBalance.mockImplementation(() => 90);
                  // log the user in first
                  await dispatch.user.login('0xUserAddress');
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  buy.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.buyTokensFailure,
                        });
                        expect(logErrorCalls).toHaveLength(1);
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

            it("Approves the Users contract to transfer those tokens on the user's behalf", async (done) => {
                  getContractAddress.mockImplementation(
                        () => '0xContractAddress',
                  );
                  await dispatch.user.buyTokens(2);
                  setTimeout(() => {
                        expect(approveProxy.mock.calls).toHaveLength(1);
                        expect(approveProxy.mock.calls[0][0]).toEqual(
                              '0xUserAddress',
                        );
                        expect(approveProxy.mock.calls[0][1]).toEqual(
                              '0xContractAddress',
                        );
                        expect(approveProxy.mock.calls[0][2]).toEqual(92);
                        done();
                  }, 1);
            });
      });

      describe('addVoteToRecord', () => {
            it("Adds the vote to the user' record on the blockchain and updates the state for voting recored and tokens", async (done) => {
                  await dispatch.user.addVoteToRecord('Candidate2');
                  expect(addVoteFor.mock.calls).toHaveLength(1);
                  expect(addVoteFor.mock.calls[0][0]).toEqual('Candidate2');
                  setTimeout(() => {
                        expect(store.getState().user.votingRecord).toEqual({
                              Candidate1: 4,
                              Candidate2: 1,
                        });
                        // substract a token
                        expect(store.getState().user.tokens).toEqual(91);
                        done();
                  });
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  addVoteFor.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.user.addVoteToRecord('Candidate2');
                  setTimeout(() => {
                        const logErrorCalls = Log.error.mock.calls;
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.unexpectedError,
                        });
                        expect(logErrorCalls).toHaveLength(1);
                        expect(logErrorCalls[0][0].message).toEqual('error');
                        done();
                  }, 1);
            });
      });
});
