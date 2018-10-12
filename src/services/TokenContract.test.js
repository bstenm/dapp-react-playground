import web3 from './Web3';
import {Token} from './ContractsInstances';
import {BigNumber} from 'bignumber.js';
import {getUserBalance, transferTo} from './TokenContract';

jest.mock('./Web3');
jest.mock('./ContractsInstances');

const {mockImplementation} = Token.deployed;

describe('getUserBalance', () => {

      it('Retlance for the address passed', async () => {
            mockImplementation(() => ({ balanceOf: () => new BigNumber(24) }));
            const balance = await getUserBalance('0xUserAddress');
            expect(balance).toEqual(24);
      });
});

describe('transferTo', () => {

      it('Transfer tokens to the address passed', async () => {
            const transferSpy = jest.fn();
            web3.eth.accounts = ['0xAdmin'];
            mockImplementation(() => ({ transfer: transferSpy }));
            await transferTo('0xRecipientAddress', 4);
            expect(transferSpy.mock.calls.length).toEqual(1);
            expect(transferSpy.mock.calls[0][0] ).toEqual('0xRecipientAddress');
            expect(transferSpy.mock.calls[0][1] ).toEqual(4);
            expect(transferSpy.mock.calls[0][2].from ).toEqual('0xAdmin');
      });
});
