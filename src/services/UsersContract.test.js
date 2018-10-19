import {gas} from '../config';
import web3 from './Web3';
import {Users} from './ContractsInstances';
import {BigNumber} from 'bignumber.js';
import {registerUser, getUserData, getTotalVotesFor, getContractAddress} from './UsersContract';

jest.mock('./Web3');
jest.mock('./ContractsInstances');

const {mockImplementation} = Users.deployed;

describe('registerUser', () => {

      it('Registers a new user on the blockchain', async () => {
            const registerSpy = jest.fn();
            mockImplementation(() => ({ register: registerSpy }));
            await registerUser('0xUserAddress');
            expect(registerSpy.mock.calls.length).toEqual(1);
            expect(registerSpy.mock.calls[0][0].from).toEqual('0xUserAddress');
            expect(registerSpy.mock.calls[0][0].gas).toEqual(gas.registration);
      });
});

describe('getUserData', () => {

      it('Returns empty object if no data found fot that user', async () => {
            mockImplementation(() => ({ userData: () => []}));
            const data = await getUserData('0xUserAddress');
            expect(data).toEqual({});
      });

      it('Fetches the user data from the blockchain', async () => {
            Users.deployed.mockImplementation(() => ({
                  userData: () => [
                        [
                              new BigNumber(4),
                              new BigNumber(3),
                              new BigNumber(0)
                        ],
                        '0xUserAddress'
                  ]})
            );
            const data = await getUserData('0xUserAddress');

            expect(data.address).toEqual('0xUserAddress');
            expect(data.votingRecord).toEqual({ Hilary: 4, Trump: 3, Jill: 0 });
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