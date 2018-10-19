import {gas} from '../config';
import {UserActions} from './ContractsInstances';
import {voteFor, addCandidateInfo} from './UserActionsContract';

jest.mock('./ContractsInstances');

const {mockImplementation} = UserActions.deployed;

describe('voteForCandidate', () => {

      it('Saves a vote for a candidate on the blockchain', async () => {
            const voteForCandidateSpy = jest.fn();
            mockImplementation(() => ({ voteForCandidate: voteForCandidateSpy }));
            await voteFor('Trump', 'Joanna', '0xUserAddress');
            expect(voteForCandidateSpy.mock.calls.length).toEqual(1);
            expect(voteForCandidateSpy.mock.calls[0][0]).toEqual('Trump');
            expect(voteForCandidateSpy.mock.calls[0][1]).toEqual('Joanna');
            expect(voteForCandidateSpy.mock.calls[0][2].from).toEqual('0xUserAddress');
            expect(voteForCandidateSpy.mock.calls[0][2].gas).toEqual(gas.vote);
      });
});

describe('addCandidateInfo', () => {

      it('Saves the new info into the blockchain', async () => {
            let addInfoSpy = jest.fn();
            mockImplementation(() => ({ addInfo: addInfoSpy }));
            await addCandidateInfo({
                  title: 'Title',
                  fileHash: 'fileHash',
                  candidate: 'Trump',
                  description: 'description'
            }, '0xUserAddress');
            expect(addInfoSpy.mock.calls.length).toEqual(1);
            expect(addInfoSpy.mock.calls[0][0]).toEqual('Trump');
            expect(addInfoSpy.mock.calls[0][1]).toEqual('Title');
            expect(addInfoSpy.mock.calls[0][2]).toEqual('description');
            expect(addInfoSpy.mock.calls[0][3]).toEqual('fileHash');
            expect(addInfoSpy.mock.calls[0][4].from).toEqual('0xUserAddress');
            expect(addInfoSpy.mock.calls[0][4].gas).toEqual(gas.addInfo);
      });
});

describe('getTotalVotesFor', () => {

      it('Returns the vote tally of a candidate' , () => {

      });
});