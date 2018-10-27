import { token } from '../config';
import { TokenSale } from './ContractsInstances';

export const buy = async (from, val) => {
      const contract = await TokenSale.deployed();
      // value of tokens in wei
      const value = token.priceInWei * val;
      await contract.buy(val, { from, value });
};

export const getContractAddress = async () => {
      const contract = await TokenSale.deployed();
      return contract.address;
};
