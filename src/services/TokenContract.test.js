import {Token} from './ContractsInstances';
import {BigNumber} from 'bignumber.js';
import {getUserBalance} from './TokenContract';

jest.mock('./ContractsInstances');

const {mockImplementation} = Token.deployed;

describe('getUserBalance', () => {

      it('Calls the blockchain to transfer tokens from the token sale contract to the user', async () => {
            mockImplementation(() => ({ balanceOf: () => new BigNumber(24) }));
            const balance = await getUserBalance('0xUserAddress');
            expect(balance).toEqual(24);
      });
});
