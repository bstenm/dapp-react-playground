import ms from '../config/messages';
import user from './user';
import store from '../store';
import {dispatch} from '@rematch/core';
import candidates from './candidates';
import VotingService from '../services/Voting';

jest.mock('../services/Voting');

describe('(Effects) Candidates state', () => {

      it('(getVotes) Dispatches an alert when error thrown', (done) => {
            VotingService.totalVotesFor.mockImplementation(() => new Promise( res => {throw new Error()}));
            dispatch({type: 'candidates/getVotes'});
            setTimeout(() => {
                  expect(store.getState().alert).toEqual(ms.retrieveVotesFailure);
                  done();
            }, 1);
      });

      it('(getVotes) Gets the candidates votes into the state', (done) => {
            VotingService.totalVotesFor.mockImplementation( name => name === 'Hilary' ? '0' : (name === 'Trump' ? '1': '2'));
            dispatch({type: 'candidates/getVotes'});
            setTimeout(() => {
                  expect(store.getState().candidates).toEqual([
                        {name: 'Hilary', vote: '0'},
                        {name: 'Trump', vote: '1'},
                        {name: 'Jill', vote: '2'},
                  ]);
                  done();
            }, 1);
      });

      it('(addVote) Gets the candidates votes into the state', (done) => {
            VotingService.voteFor.mockImplementation(() => null);
            VotingService.totalVotesFor.mockImplementation(() => '3');
            dispatch({type: 'candidates/addVote', payload: 'Jill'});
            setTimeout(() => {
                  expect(VotingService.voteFor.mock.calls.length).toEqual(1);
                  expect(VotingService.voteFor.mock.calls[0][0]).toEqual('Jill');
                  expect(store.getState().candidates).toEqual([
                        // ! leaking from previous test !
                        {name: 'Jill', vote: '3'},
                        {name: 'Hilary', vote: '0'},
                        {name: 'Trump', vote: '1'},
                  ]);
                  done();
            }, 1);
      });

      it('(addVote) Dispatches an alert when error thrown', (done) => {
            VotingService.voteFor.mockImplementation(() => new Promise( res => {throw new Error()}));
            dispatch({type: 'candidates/addVote', payload: 'Jill'});
            setTimeout(() => {
                  expect(store.getState().alert).toEqual(ms.notEnoughFunds);
                  done();
            }, 1);
      });
});

describe('(Reducer) Candidates state', () => {

      it('(updateList) Updates the list of candidates', () => {
            const newState = candidates.reducers.updateList([
                  {name: 'Jill', vote: '0'},
                  {name: 'Hilary', vote: '0'},
                  {name: 'Trump', vote: '0'},
            ], [
                  {name: 'Jill', vote: '1'},
                  {name: 'Hilary', vote: '0'},
                  {name: 'Trump', vote: '0'},
            ]);
            expect(newState).toEqual([
                  {name: 'Jill', vote: '1'},
                  {name: 'Hilary', vote: '0'},
                  {name: 'Trump', vote: '0'},
            ]);
      });
});
