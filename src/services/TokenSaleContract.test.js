import web3 from './Web3';
import { token } from '../config';
import { TokenSale } from './ContractsInstances';
import { buy, getContractAddress } from './TokenSaleContract';

jest.mock('./ContractsInstances');

describe('buy', () => {
      it('Calls the blockchain to transfer tokens from the token sale contract to the user', async (done) => {
            const buySpy = jest.fn();
            TokenSale.deployed.mockImplementation(() => ({ buy: buySpy }));
            await buy('0xUserAddress', 4);
            setTimeout(() => {
                  expect(buySpy.mock.calls).toHaveLength(1);
                  expect(buySpy.mock.calls[0][0]).toEqual(4);
                  expect(buySpy.mock.calls[0][1].from).toEqual('0xUserAddress');
                  expect(buySpy.mock.calls[0][1].value).toEqual(
                        token.priceInWei * 4,
                  );
                  done();
            }, 1);
      });
});

describe('getContractAddress', () => {
      it('Returns the address of the contract', async () => {
            TokenSale.deployed.mockImplementation(() => ({
                  address: '0xContractAddress',
            }));
            const address = await getContractAddress();
            expect(address).toEqual('0xContractAddress');
      });
});
