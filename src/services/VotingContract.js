import cf from '../config';
import web3 from './Web3';
import contract from 'truffle-contract';
import difference from 'lodash/difference';
import contractArtifacts from '../contracts/Voting.json';

const Contract = contract(contractArtifacts);

Contract.setProvider(web3.currentProvider);

// [TOREMOVE]: won't need it when Solidity contract takes care of setting the proxy approval
export const getVotingContractAddress = async () => {
      const ct = await Contract.deployed();
      return ct.address;
};

export const getNewAddress = async () => {
      const ct = await Contract.deployed();
      const addresses = await ct.getVoterAddresses();
      const {accounts} = web3.eth;
      // 1 because first index (0) is for admin
      return difference(accounts, addresses)[1];
};

export const registerUser = async (name, from) => {
      const ct = await Contract.deployed();
      const gas = 150000;
      await ct.registerVoter(name, {from, gas});
}

export const getUserData = async (name) => {
      const  {voterDetails} = await Contract.deployed();
      const [record, address, id] =  await voterDetails(name);
      const user = web3.toUtf8(id);
      if (! user) return {}; // * exit if not found *
      const votingRecord = cf.candidates.reduce((r, v, k) => {
            r[v] = record[k].toNumber();
            return r;
      }, {});
      return { votingRecord, user, address };
};

export const getTotalVotesFor = async (name) => {
      const  contract = await Contract.deployed();
      const vote = await contract.totalVotesFor(name);
      return vote.toString();
};

export const voteForCandidate = async (candidate, name, from) => {
      const  contract = await Contract.deployed();
      const gas = 200000;
      await contract.voteForCandidate(candidate, name, {from, gas});
}