import ms from '../config/messages';
import Web3 from 'web3';
import contract from 'truffle-contract';
import difference from 'lodash/difference';
import votingArtifacts from '../build/contracts/Voting.json';

const Voting = contract(votingArtifacts);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const {accounts} = web3.eth;
Voting.setProvider(web3.currentProvider);

const register = async name => {
      const nameInBytes = web3.fromUtf8(name);
      const contractInstance = await Voting.deployed();
      const addresses = await contractInstance.getVoterAddresses();
      const availables = difference(accounts, addresses);
      const from = availables[0];
      if (! from) {
            throw new Error(ms.noMoreRegistrationAllowed);
      }
      await contractInstance.registerVoter(nameInBytes, {from, gas: 150000});
      return from;
};

const login = async name => {
      const  contractInstance = await Voting.deployed();
      const [tokens, record, address, username] =  await contractInstance.voterDetails(name);
      const registered = web3.toUtf8(username) === name;
      // first check if already registered
      return {
            tokens: registered ? tokens.toNumber() : 0,
            record: registered ? record.map(e => e.toNumber()) : {},
            address: registered ? address : await register(name)
      }
};

const buyTokens = async (nb, {name, address}) => {
      const  contractInstance = await Voting.deployed();
      const value = web3.toWei('0.000000001', 'ether') * nb;
      await contractInstance.buyTokens(name, {from: address, value});
};

const totalVotesFor = async name => {
      const  contractInstance = await Voting.deployed();
      const vote = await contractInstance.totalVotesFor(name);
      return vote.toString();
};

const voteFor = async (candidate, {name, address}) => {
      const  contractInstance = await Voting.deployed();
      console.log('>>>> 111111', candidate, name, address);
      await contractInstance.voteForCandidate(
            web3.fromUtf8(candidate),
            web3.fromUtf8(name),
            {from: address}
      );
};

export default {
      login,
      voteFor,
      buyTokens,
      totalVotesFor,
};