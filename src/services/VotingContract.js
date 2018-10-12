import cf from '../config';
import web3 from './Web3';
import {Voting} from './ContractsInstances';
import difference from 'lodash/difference';

// [TOREMOVE]: won't need it when Solidity contract takes care of setting the proxy approval
export const getVotingContractAddress = async () => {
      const ct = await Voting.deployed();
      return ct.address;
};

export const getNewAddress = async () => {
      const ct = await Voting.deployed();
      const addresses = await ct.getVoterAddresses();
      const accounts = await web3.eth.getAccounts();
      // 1 because first index (0) is for admin
      return difference(accounts, addresses)[1];
};

export const registerUser = async (name, from) => {
      const ct = await Voting.deployed();
      const gas = cf.gas.registration;
      await ct.registerVoter(name, {from, gas});
}

export const getUserData = async (name) => {
      const  {voterDetails} = await Voting.deployed();
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
      const  contract = await Voting.deployed();
      const vote = await contract.totalVotesFor(name);
      return vote.toString();
};

export const voteForCandidate = async (candidate, name, from) => {
      const  contract = await Voting.deployed();
      const gas = cf.gas.vote;
      await contract.voteForCandidate(candidate, name, {from, gas});
}