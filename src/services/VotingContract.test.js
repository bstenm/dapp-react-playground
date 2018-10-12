import web3 from './Web3';
import {Voting} from './ContractsInstances';
import {BigNumber} from 'bignumber.js';
import {gas, candidates} from '../config';
import {getNewAddress, registerUser, getUserData, getTotalVotesFor, voteForCandidate} from './VotingContract';

jest.mock('./Web3');
jest.mock('./ContractsInstances');

const {mockImplementation} = Voting.deployed;

describe('getNewAddress', () => {

      it('Returns the next available address', async () => {
            web3.eth.getAccounts.mockImplementation(() => ['0x1', '0x2', '0x3', '0x4']);
            mockImplementation(() => ({ getVoterAddresses: () => ['0x2', '0x3']  }));
            const newAddress = await getNewAddress();
            expect(newAddress).toEqual('0x4');
      });
});

describe('registerUser', () => {

      it('Registers a new user on the blockchain', async () => {
            const registerVoterSpy = jest.fn();
            mockImplementation(() => ({ registerVoter: registerVoterSpy }));
            await registerUser('Joanna', '0xUserAddress');
            expect(registerVoterSpy.mock.calls.length).toEqual(1);
            expect(registerVoterSpy.mock.calls[0][0]).toEqual('Joanna');
            expect(registerVoterSpy.mock.calls[0][1].from).toEqual('0xUserAddress');
            expect(registerVoterSpy.mock.calls[0][1].gas).toEqual(gas.registration);
      });
});

describe('getUserData', () => {

      it('Returns empty object if no data found fot that user', async () => {
            mockImplementation(() => ({ voterDetails: () => []}));
            const data = await getUserData('Joanna');
            expect(data).toEqual({});
      });

      it('Fetches the user data from the blockchain', async () => {
            web3.toUtf8.mockImplementation(() => 'Joanna');
            // web3.fromUtf8.mockReset();
            Voting.deployed.mockImplementation(() => ({
                  voterDetails: () => [
                        [
                              new BigNumber(4),
                              new BigNumber(3),
                              new BigNumber(0)
                        ],
                        '0xJoannaAddress',
                        'Joanna',
                  ]})
            );
            const data = await getUserData('Joanna');
            expect(data.user).toEqual('Joanna');
            expect(data.address).toEqual('0xJoannaAddress');
            expect(data.votingRecord).toEqual({ Hilary: 4, Trump: 3, Jill: 0 });
      });
});

describe('getTotalVotesFor', () => {

      it('Returns a candidate\'s  vote data', async () => {
            mockImplementation(() => ({ totalVotesFor: () => new BigNumber(3) }));
            const vote = await getTotalVotesFor('Trump');
            expect(vote).toEqual('3');
      });
});

describe('voteForCandidate', () => {

      it('Saves a vote for a candidate on the blockchain', async () => {
            const voteForCandidateSpy = jest.fn();
            mockImplementation(() => ({ voteForCandidate: voteForCandidateSpy }));
            await voteForCandidate('Trump', 'Joanna', '0xUserAddress');
            expect(voteForCandidateSpy.mock.calls.length).toEqual(1);
            expect(voteForCandidateSpy.mock.calls[0][0]).toEqual('Trump');
            expect(voteForCandidateSpy.mock.calls[0][1]).toEqual('Joanna');
            expect(voteForCandidateSpy.mock.calls[0][2].from).toEqual('0xUserAddress');
            expect(voteForCandidateSpy.mock.calls[0][2].gas).toEqual(gas.vote);
      });
});
