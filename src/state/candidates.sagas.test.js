import { init } from '@rematch/core';
import cf from '../config';
import Log from '../services/Log';
import user from './user';
import alert from './alert';
import * as ms from '../config/messages';
import history from '../history';
import loading from './loading';
import candidates from './candidates';
import uploadToIpfs from '../libs/ipfsLib';
import * as CandidatesContract from '../services/CandidatesContract';

const store = init({
      models: {
            candidates,
            loading,
            alert,
            user
      }
});

const { dispatch } = store;

jest.mock('../libs/ipfsLib');
jest.mock('../services/Log');
jest.mock('../services/CandidatesContract');

const {
      getTotalVotesFor,
      getCandidateInfo,
      addCandidateInfo,
      addVoteFor
} = CandidatesContract;

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

            it('Adds the info fectched to the state for that candicate', async done => {
                  getCandidateInfo.mockImplementation(() => ['candidate info']);
                  await dispatch.candidates.fetchInfo('Asif Ali Zardari');
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const { info } = state.find(
                              e => e.name === 'Asif Ali Zardari'
                        );
                        expect(info).toEqual(['candidate info']);
                        done();
                  }, 1);
            });

            it('Dispatches an alert and logs when error thrown', async done => {
                  getCandidateInfo.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.candidates.fetchInfo('Asif Ali Zardari');
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.retrieveDataFailure
                        });
                        expect(Log.error.mock.calls).toHaveLength(1);
                        expect(Log.error.mock.calls[0][0].message).toEqual(
                              'error'
                        );
                        done();
                  }, 1);
            });
      });

      describe('addInfo', () => {
            const info = {
                  file: 'file',
                  title: 'title',
                  candidate: 'Asif Ali Zardari',
                  description: 'description'
            };

            beforeEach(() => {
                  uploadToIpfs.mockImplementation(file => `${file}hash`);
                  // we need to have a user in the state
                  dispatch.user.setUserData({ address: '0xUserAdress' });
            });

            afterEach(() => {
                  addCandidateInfo.mockReset();
            });

            it('Adds the user entered info  to the state for that candicate', async done => {
                  await dispatch.candidates.addInfo(info);
                  setTimeout(() => {
                        const arg = addCandidateInfo.mock.calls[0];
                        expect(addCandidateInfo.mock.calls).toHaveLength(1);
                        expect(arg[0].candidate).toEqual('Asif Ali Zardari');
                        expect(arg[0].title).toEqual('title');
                        expect(arg[0].description).toEqual('description');
                        expect(arg[0].attachmentHash).toEqual('filehash');
                        expect(arg[1]).toEqual('0xUserAdress');
                        done();
                  }, 1);
            });

            it('Adds the user entered info  to the state for that candicate with attahcment hash set to null if no attahcment provided', async done => {
                  const { file, ...infoNoFile } = info;
                  await dispatch.candidates.addInfo(infoNoFile);
                  setTimeout(() => {
                        const arg = addCandidateInfo.mock.calls[0];
                        expect(addCandidateInfo.mock.calls).toHaveLength(1);
                        expect(arg[0].candidate).toEqual('Asif Ali Zardari');
                        expect(arg[0].title).toEqual('title');
                        expect(arg[0].description).toEqual('description');
                        expect(arg[0].attachmentHash).toEqual(null);
                        expect(arg[1]).toEqual('0xUserAdress');
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async done => {
                  addCandidateInfo.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.candidates.addInfo(info);
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.notSaved
                        });
                        expect(Log.error.mock.calls).toHaveLength(1);
                        expect(Log.error.mock.calls[0][0].message).toEqual(
                              'error'
                        );
                        done();
                  }, 1);
            });

            it('Redirests the user to the voting page', async () => {
                  jest.spyOn(history, 'push');
                  await dispatch.candidates.addInfo(info);
                  expect(history.push.mock.calls).toHaveLength(1);
                  expect(history.push.mock.calls[0][0]).toEqual(
                        cf.routes.voting
                  );
            });
      });

      describe('fetchVotes', () => {
            afterEach(() => {
                  getTotalVotesFor.mockReset();
            });

            it('Sets the votes fectched for all  candicates to the state', async done => {
                  getTotalVotesFor.mockImplementation(
                        name =>
                              ({
                                    'Asif Ali Zardari': 2,
                                    'Khalifa Bin Zayed': 3
                              }[name])
                  );
                  await dispatch.candidates.fetchVotes();
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const vote = name =>
                              state.find(e => e.name === name).vote;
                        expect(vote('Asif Ali Zardari')).toEqual(2);
                        expect(vote('Khalifa Bin Zayed')).toEqual(3);
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async done => {
                  getTotalVotesFor.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.candidates.fetchVotes();
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.retrieveDataFailure
                        });
                        expect(Log.error.mock.calls).toHaveLength(1);
                        expect(Log.error.mock.calls[0][0].message).toEqual(
                              'error'
                        );
                        done();
                  }, 1);
            });
      });

      describe('addVotes', () => {
            beforeEach(async () => {
                  // we need to have a user in the state
                  await dispatch.user.setUserData({
                        address: '0xUserAdress',
                        name: 'username'
                  });
            });

            afterEach(() => {
                  getTotalVotesFor.mockReset();
                  addVoteFor.mockReset();
            });

            it('Adds the votes entered by user to the state for this candidate', async done => {
                  getTotalVotesFor.mockImplementation(
                        name =>
                              ({
                                    'Asif Ali Zardari': 2,
                                    'Khalifa Bin Zayed': 4
                              }[name])
                  );
                  await dispatch.candidates.addVote('Khalifa Bin Zayed');
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const { vote } = state.find(
                              e => e.name === 'Khalifa Bin Zayed'
                        );
                        expect(vote).toEqual(4);
                        // [TODO]: why calls length is 0?
                        expect(addVoteFor.mock.calls).toHaveLength(1);
                        expect(addVoteFor.mock.calls[0][0]).toEqual(
                              'Khalifa Bin Zayed'
                        );
                        done();
                  }, 1);
            });

            it('Dispatches an action to update the user voting record', async () => {
                  jest.spyOn(dispatch.user, 'addVoteToRecord');
                  await dispatch.candidates.addVote('Khalifa Bin Zayed');
                  expect(dispatch.user.addVoteToRecord.mock.calls).toHaveLength(
                        1
                  );
                  expect(
                        dispatch.user.addVoteToRecord.mock.calls[0][0]
                  ).toEqual('Khalifa Bin Zayed');
            });

            it('Dispatches an alert when error thrown', async done => {
                  addVoteFor.mockImplementation(() => {
                        throw new Error('error');
                  });
                  await dispatch.candidates.addVote('Khalifa Bin Zayed');
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.notEnoughFunds
                        });
                        expect(logErrorSpy.mock.calls).toHaveLength(1);
                        expect(Log.error.mock.calls[0][0].message).toEqual(
                              'error'
                        );
                        done();
                  }, 1);
            });
      });
});
