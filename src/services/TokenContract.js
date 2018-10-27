import web3 from './Web3';
import { Token } from './ContractsInstances';

export const getUserBalance = async (address) => {
      const ct = await Token.deployed();
      const balance = await ct.balanceOf(address);
      return balance.toNumber();
};

export const transferTo = async (recipent, val) => {
      const from = await web3.eth.accounts[0];
      const { transfer } = await Token.deployed();
      await transfer(recipent, val, { from });
};

export const approveProxy = async (from, proxy, nb) => {
      const ct = await Token.deployed();
      await ct.approve(proxy, nb, { from });
};
