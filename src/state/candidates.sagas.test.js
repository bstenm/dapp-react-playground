import cf from '../config';
import Log from '../services/Log';
import user from './user';
import {init} from '@rematch/core';
import alert from './alert';
import web3 from '../services/Web3';
import * as ms from '../config/messages';
import history from '../history';
import loading from './loading';
import candidates from './candidates';
import * as ipfsLib from '../libs/ipfsLib';
import * as CandidatesContract from '../services/CandidatesContract';

const store = init({ models: { candidates, loading, alert, user }});
const { dispatch } = store;

jest.mock('../libs/ipfsLib');
jest.mock('../services/Log');
jest.mock('../services/CandidatesContract');

const {getTotalVotesFor, getCandidateInfo, addCandidateInfo, addVoteFor} = CandidatesContract;

const initialState = [
      {name: 'Hilary', vote: 0, info: []},
      {name: 'Trump', vote: 0, info: []},
      {name: 'Jill', vote: 0, info: []}
];

describe('(Effects) candidates', () => {
      let logErrorSpy;

      beforeEach(() => {
            logErrorSpy = jest.spyOn(Log, 'error');
      });

      afterEach(() => {
            logErrorSpy.mockReset();
      });

      describe('fetchInfo', () => {

            afterEach(() => {
                  getCandidateInfo.mockReset();
            });

            it('Adds the info fectched to the state for that candicate', async (done) => {
                  getCandidateInfo.mockImplementation(() => ['candidate info']);
                  await dispatch.candidates.fetchInfo('Hilary');
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const {info} = state.find(e => e.name === 'Hilary');
                        expect(info).toEqual(['candidate info']);
                        done();
                  }, 1);
            });

            it('Dispatches an alert and logs when error thrown', async (done) => {
                  getCandidateInfo.mockImplementation(() => { throw new Error('error')});
                  await dispatch.candidates.fetchInfo('Hilary');
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.retrieveDataFailure
                        });
                        expect(Log.error.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('error');
                        done();
                  }, 1);
            });
      });

      describe('addInfo', () => {
            let info = {
                  file: 'file',
                  title: 'title',
                  candidate: 'Hilary',
                  description: 'description'
            };

            beforeEach(() => {
                  ipfsLib.uploadToIpfs.mockImplementation(file => file + 'hash');
                  // we need to have a user in the state
                  dispatch.user.setUserData({ address: '0xUserAdress' });
            });

            afterEach(() => {
                  addCandidateInfo.mockReset();;
            });

            it('Adds the user entered info  to the state for that candicate', async () => {
                  await dispatch.candidates.addInfo(info);
                  setTimeout(() => {
                        expect(addInfo.mock.calls.length).toEqual(1);
                        expect(addInfo.mock.calls[0][0]).toEqual('Hilary');
                        expect(addInfo.mock.calls[0][1]).toEqual('title');
                        expect(addInfo.mock.calls[0][2]).toEqual('description');
                        expect(addInfo.mock.calls[0][3]).toEqual('filehash');
                        expect(addInfo.mock.calls[0][4].gas).toEqual(500000);
                        expect(addInfo.mock.calls[0][4].from).toEqual('0xUserAdress');
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  addCandidateInfo.mockImplementation(() => {throw new Error('error')});
                  await dispatch.candidates.addInfo(info);
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.notSaved
                        });
                        expect(Log.error.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('error');
                        done();
                  }, 1);
            });

            it('Redirests the user to the voting page', async () => {
                  jest.spyOn(history, 'push');
                  await dispatch.candidates.addInfo(info);
                  expect(history.push.mock.calls.length).toEqual(1);
                  expect(history.push.mock.calls[0][0] ).toEqual(cf.routes.voting);
            });
      });

      describe('fetchVotes', () => {

            afterEach(() => {
                  getTotalVotesFor.mockReset();
            });

            it('Sets the votes fectched for all  candicates to the state', async (done) => {
                  getTotalVotesFor.mockImplementation(name => ({ Hilary: 2, Trump: 3 }[name]));
                  await dispatch.candidates.fetchVotes();
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const vote = name => state.find(e => e.name === name).vote;
                        expect(vote('Hilary')).toEqual(2);
                        expect(vote('Trump')).toEqual(3);
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  getTotalVotesFor.mockImplementation(() => {throw new Error('error')});
                  await dispatch.candidates.fetchVotes();
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.retrieveDataFailure
                        });
                        expect(Log.error.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('error');
                        done();
                  }, 1);
            });
      });

      describe('addVotes', () => {

            beforeEach(async () => {
                  // we need to have a user in the state
                  await dispatch.user.setUserData({ address: '0xUserAdress', name: 'username' });
            });

            afterEach(() => {
                  getTotalVotesFor.mockReset();
                  addVoteFor.mockReset();
            });

            it('Adds the votes entered by user to the state for this candidate', async (done) => {
                  getTotalVotesFor.mockImplementation(name => ({ Hilary: 2, Trump: 4 }[name]));
                  await dispatch.candidates.addVote('Trump');
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const {vote} = state.find(e => e.name === 'Trump');
                        expect(vote).toEqual(4);
                        // [TODO]: why calls length is 0?
                        expect(addVoteFor.mock.calls.length).toEqual(1);
                        expect(addVoteFor.mock.calls[0][0] ).toEqual('Trump');
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  addVoteFor.mockImplementation(() => {throw new Error('error')});
                  await dispatch.candidates.addVote('Trump');
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.notEnoughFunds
                        });
                        expect(logErrorSpy.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('error');
                        done();
                  }, 1);
            });
      });
});
