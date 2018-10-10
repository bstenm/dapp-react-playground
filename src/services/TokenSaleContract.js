import web3 from './Web3';
import {token} from '../config';
import contract from 'truffle-contract';
import contractArtifacts from '../contracts/CorrTokenSale.json';

const Contract = contract(contractArtifacts);

Contract.setProvider(web3.currentProvider);

export const buy = async (from, val) => {
      const contract = await Contract.deployed();
      // value of tokens in wei
      const value =token.priceInWei * val;
      await contract.buy(val, { from, value });
};

export default Contract;