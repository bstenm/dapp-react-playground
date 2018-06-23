import ms from '../config/messages';
import user from './user';
import store from '../store';
import {dispatch} from '@rematch/core';
import VotingService from '../services/Voting';

jest.mock('../services/Voting');

VotingService.login
      .mockImplementationOnce(() => new Promise( res => {throw new Error()}))
      .mockImplementationOnce(() => ({
            tokens: 0,
            record: [0, 0, 0],
            address: '0X3r'
      }));

VotingService.buyTokens
      .mockImplementationOnce(() => new Promise( res => {throw new Error()}))
      .mockImplementationOnce(() => null);

describe('(Effects) User state', () => {

      it('(login) Dispatches an alert when error thrown', (done) => {
            dispatch({ type: 'user/login', payload: 'Joanna'});
            setTimeout(() => {
                  expect(store.getState().user).toEqual({});
                  expect(store.getState().alert).toEqual(ms.retrieveVotesFailure);
                  done();
            }, 1);
      })

      it('(login) Sets the user data into the state', (done) => {
            dispatch({ type: 'user/login', payload: 'Joanna'});
            setTimeout(() => {
                  const user = store.getState().user;
                  expect(user.name).toEqual('Joanna');
                  expect(user.tokens).toEqual(0);
                  expect(user.address).toEqual('0X3r');
                  expect(user.votingRecord).toEqual({Hilary: 0, Jill: 0, Trump: 0});
                  done();
            }, 1);
      });

      it('(buyTokens) Dispatches an alert when error thrown', (done) => {
            dispatch({ type: 'user/buyTokens', payload: 2});
            setTimeout(() => {
                  expect(store.getState().alert).toEqual(ms.buyTokensFailure);
                  done();
            }, 1);
      });

      it('(buyTokens) Updates the user tokens nb in state', (done) => {
            dispatch({ type: 'user/buyTokens', payload: 2});
            setTimeout(() => {
                  expect(store.getState().user.tokens).toEqual(2);
                  done();
            }, 1);
      });
});
