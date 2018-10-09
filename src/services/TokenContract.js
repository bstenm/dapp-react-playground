import cf from '../config';
import web3 from './Web3';
import contract from 'truffle-contract';
import contractArtifacts from '../contracts/CorrToken.json';

const Contract = contract(contractArtifacts);

Contract.setProvider(web3.currentProvider);

export const getUserBalance = async (address) => {
      const ct = await Contract.deployed();
      const balance = await ct.balanceOf(address);
      return balance.toNumber();
};

export const approveProxy = async (from, proxy, nb) => {
      const ct = await Contract.deployed();
      await ct.approve(proxy.address, nb, {from});
};