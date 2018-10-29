import { BigNumber } from 'bignumber.js';
import { Users } from './ContractsInstances';
import { gas, candidates } from '../config';
import {
      addVoteFor,
      registerUser,
      getUserData,
      getContractAddress
} from './UsersContract';

jest.mock('./Web3');
jest.mock('./ContractsInstances');

const { mockImplementation } = Users.deployed;

describe('registerUser', () => {
      it('Registers a new user on the blockchain', async () => {
            const registerSpy = jest.fn();
            mockImplementation(() => ({ register: registerSpy }));
            await registerUser('0xUserAddress');
            expect(registerSpy.mock.calls).toHaveLength(1);
            expect(registerSpy.mock.calls[0][0].from).toEqual('0xUserAddress');
            expect(registerSpy.mock.calls[0][0].gas).toEqual(gas.registration);
      });
});

describe('getUserData', () => {
      it('Returns empty object for voting record if no data found fot that user', async () => {
            mockImplementation(() => ({ userData: () => [null, '0x0000'] }));
            const data = await getUserData('0xUserAddress');
            expect(data).toEqual({ votingRecord: {} });
      });

      it('Fetches the user data from the blockchain', async () => {
            Users.deployed.mockImplementation(() => ({
                  userData: () => [
                        [new BigNumber(4), new BigNumber(3), new BigNumber(0)],
                        '0xUserAddress'
                  ]
            }));
            const data = await getUserData('0xUserAddress');
            expect(data.userAddress).toEqual('0xUserAddress');
            expect(data.votingRecord).toEqual({
                  [candidates[0]]: 4,
                  [candidates[1]]: 3,
                  [candidates[2]]: 0
            });
      });
});

describe('getContractAddress', () => {
      it('Returns the contract address', async () => {
            Users.deployed.mockImplementation(() => ({
                  address: '0xContractAddress'
            }));
            const address = await getContractAddress();
            expect(address).toEqual('0xContractAddress');
      });
});

describe('addVoteFor', () => {
      it('Saves the new vote on the blockchain by passing the index of the candidate rather than her name', async () => {
            const updateVotingRecordSpy = jest.fn();
            Users.deployed.mockImplementation(() => ({
                  updateVotingRecord: updateVotingRecordSpy
            }));
            await addVoteFor(candidates[2]);
            expect(updateVotingRecordSpy.mock.calls).toHaveLength(1);
            expect(updateVotingRecordSpy.mock.calls[0][0]).toEqual(2);
      });
});
