import { BigNumber } from 'bignumber.js';
import cf from '../config';
import web3 from './Web3';
import { Candidates } from './ContractsInstances';
import {
      getCandidateInfo,
      getTotalVotesFor,
      addCandidateInfo,
      addVoteFor,
} from './CandidatesContract';

jest.mock('./ContractsInstances');

const { mockImplementation } = Candidates.deployed;

describe('getCandidateInfo', () => {
      it("Fetches the candidate's info from the blockchain", async () => {
            mockImplementation(() => ({
                  getCandidateInfoAt: (name, i) => [
                        ['title1', 'description1', 'null'],
                        ['title2', 'description2', 'file2'],
                  ].map(e1 => e1.map(e2 => web3.fromUtf8(e2)))[i],
            }));
            const infos = await getCandidateInfo('Khalifa Bin Zayed');
            expect(infos).toEqual([
                  {
                        title: 'title1',
                        description: 'description1',
                        fileHash: null,
                  },
                  {
                        title: 'title2',
                        description: 'description2',
                        fileHash: 'file2',
                  },
            ]);
      });
});

describe('getTotalVotesFor', () => {
      it("Returns a candidate's  vote data", async () => {
            mockImplementation(() => ({
                  candidateVotes: () => new BigNumber(3),
            }));
            const vote = await getTotalVotesFor('Khalifa Bin Zayed');
            expect(vote).toEqual('3');
      });
});

describe('addCandidateInfo', () => {
      it('Adds a info item for a candidate', async () => {
            const addInfoSpy = jest.fn();
            const candidate = cf.candidates[1];
            mockImplementation(() => ({ addInfo: addInfoSpy }));
            await addCandidateInfo({
                  candidate,
                  title: 'title',
                  description: 'description',
                  attachmentHash: 'filehash',
            });
            expect(addInfoSpy.mock.calls).toHaveLength(1);
            expect(addInfoSpy.mock.calls[0][0]).toEqual(candidate);
      });
});

describe('addVoteFor', () => {
      it('Adds a vote to a candidate tally', async () => {
            const addVoteForSpy = jest.fn();
            mockImplementation(() => ({ addVoteFor: addVoteForSpy }));
            const candidate = cf.candidates[1];
            await addVoteFor(candidate);
            expect(addVoteForSpy.mock.calls).toHaveLength(1);
            expect(addVoteForSpy.mock.calls[0][0]).toEqual(candidate);
      });
});
