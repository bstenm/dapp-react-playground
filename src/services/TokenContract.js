import {Token} from './ContractsInstances';

export const getUserBalance = async (address) => {
      const ct = await Token.deployed();
      const balance = await ct.balanceOf(address);
      return balance.toNumber();
};

export const approveProxy = async (from, proxy, nb) => {
      const ct = await Token.deployed();
      await ct.approve(proxy, nb, {from});
};
