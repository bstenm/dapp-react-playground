import Log from '../services/Log';
import user from './user';
import {init} from '@rematch/core';
import alert from './alert';
import web3 from '../services/Web3';
import * as ms from '../config/messages';
import loading from './loading';
import Contracts from '../services/ContractsInstances';
import candidates from './candidates';
import * as ipfsLib from '../libs/ipfsLib';

const initialState = [
      {name: 'Hilary', vote: '0', info: []},
      {name: 'Trump', vote: '0', info: []},
      {name: 'Jill', vote: '0', info: []}
];

const store = init({ models: { candidates, loading, alert, user }});
const { dispatch } = store;

jest.mock('../libs/ipfsLib');
jest.mock('../services/Log');
jest.mock('../services/ContractsInstances');

describe('(Effects) candidates', () => {
      let addInfoSpy, logErrorSpy, voteForCandidateSpy;

      beforeEach(() => {
            addInfoSpy = jest.fn();
            voteForCandidateSpy = jest.fn();
            logErrorSpy = jest.spyOn(Log, 'error');
            Contracts.Candidates.deployed.mockImplementationOnce(() => ({
                  getInfo: (_, i) => [
                        ['Info1', 'Description1', 'fileHash1'],
                        ['Info2', 'Description2', 'fileHash2']
                  ].map( array => array.map( e => web3.fromUtf8(e)))[i],
                  addInfo: addInfoSpy
            }));
            Contracts.Candidates.deployed.mockImplementationOnce(() => ({
                  getInfo: () => { throw new Error('getInfo error') },
                  addInfo: () => { throw new Error('addInfo error') }
            }));
            Contracts.Voting.deployed.mockImplementationOnce(() => ({
                  totalVotesFor: (name) => ({ Hilary: 2, Trump: 3, Jill: 0 }[name]),
                  voteForCandidate: voteForCandidateSpy
            }));
            Contracts.Voting.deployed.mockImplementationOnce(() => ({
                  totalVotesFor: () => { throw new Error('totalVotesFor error') },
                  voteForCandidate: () => { throw new Error('voteForCandidate error') }
            }));
      });

      afterEach(() => {
            addInfoSpy.mockReset()
            voteForCandidateSpy.mockReset()
            logErrorSpy.mockReset();
      });

      describe('fetchInfo', () => {

            it('Adds the info fectched to the state for that candicate', async (done) => {
                  // corresponds to 1st mock implementation of getInfo (see above)
                  await dispatch.candidates.fetchInfo('Hilary');
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const {info} = state.find(e => e.name === 'Hilary');
                        expect(info).toEqual([
                              { title: 'Info1', description: 'Description1', fileHash: 'fileHash1'},
                              { title: 'Info2', description: 'Description2', fileHash: 'fileHash2'}
                        ]);
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  // corresponds to 2nd mock implementation of getInfo (see above)
                  await dispatch.candidates.fetchInfo('Hilary');
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.retrieveDataFailure
                        });
                        expect(Log.error.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('getInfo error');
                        done();
                  }, 1);
            });
      });

      describe('addInfo', () => {

            beforeEach(async () => {
                  // we need to have a user in the state
                  dispatch.user.setUserData({ address: '0xUserAdress' });
                  ipfsLib.uploadToIpfs.mockImplementation(file => file + 'hash');
                  await dispatch.candidates.addInfo({
                        file: 'file',
                        title: 'title',
                        candidate: 'Hilary',
                        description: 'description'
                  });
            });

            it('Adds the user entered info  to the state for that candicate', () => {
                  // corresponds to 1st mock implementation of addInfo (see above)
                  expect(addInfoSpy.mock.calls.length).toEqual(1);
                  expect(addInfoSpy.mock.calls[0][0]).toEqual('Hilary');
                  expect(addInfoSpy.mock.calls[0][1]).toEqual('title');
                  expect(addInfoSpy.mock.calls[0][2]).toEqual('description');
                  expect(addInfoSpy.mock.calls[0][3]).toEqual('filehash');
                  expect(addInfoSpy.mock.calls[0][4].gas).toEqual(500000);
                  expect(addInfoSpy.mock.calls[0][4].from).toEqual('0xUserAdress');
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  // corresponds to 2nd mock implementation of addInfo (see above)
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.notSaved
                        });
                        done();
                  }, 1);
            });
      });

      describe('fetchVotes', () => {

            it('Sets the votes fectched for all  candicates to the state', async (done) => {
                  // corresponds to 1st mock implementation of fetchVotes (see above)
                  await dispatch.candidates.fetchVotes();
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const vote = name => state.find(e => e.name === name).vote;
                        expect(vote('Hilary')).toEqual('2');
                        expect(vote('Trump')).toEqual('3');
                        expect(vote('Jill')).toEqual('0');
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  // corresponds to 2nd mock implementation of fetchVotes (see above)
                  await dispatch.candidates.fetchVotes();
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.retrieveDataFailure
                        });
                        expect(Log.error.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('totalVotesFor error');
                        done();
                  }, 1);
            });
      });

      describe('addVotes', () => {

            beforeEach(() => {
                  // we need to have a user in the state
                  dispatch.user.setUserData({ address: '0xUserAdress', name: 'username' });
            });

            it('Adds the votes entered by user to the state for this candidate', async (done) => {
                  // corresponds to 1st mock implementation of addVotes (see above)
                  await dispatch.candidates.addVote('Trump');
                  setTimeout(() => {
                        const state = store.getState().candidates;
                        const {vote} = state.find(e => e.name === 'Trump');
                        expect(vote).toEqual('3');
                        expect(voteForCandidateSpy.mock.calls.length).toEqual(1);
                        expect(voteForCandidateSpy.mock.calls[0][0] ).toEqual('Trump');
                        expect(voteForCandidateSpy.mock.calls[0][1] ).toEqual('username');
                        expect(voteForCandidateSpy.mock.calls[0][2].from ).toEqual('0xUserAdress');
                        expect(voteForCandidateSpy.mock.calls[0][2].gas ).toEqual(200000);
                        done();
                  }, 1);
            });

            it('Dispatches an alert when error thrown', async (done) => {
                  // corresponds to 2nd mock implementation of addVotes (see above)
                  await dispatch.candidates.addVote('Trump');
                  setTimeout(() => {
                        expect(store.getState().alert).toEqual({
                              type: 'danger',
                              message: ms.notEnoughFunds
                        });
                        expect(logErrorSpy.mock.calls.length).toEqual(1);
                        expect(Log.error.mock.calls[0][0].message ).toEqual('voteForCandidate error');
                        done();
                  }, 1);
            });
      });
});
