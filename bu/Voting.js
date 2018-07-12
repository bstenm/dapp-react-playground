import ms from '../config/messages';
import web3 from '../services/Web3';
import contract from 'truffle-contract';
import difference from 'lodash/difference';
import votingArtifacts from '../contracts/Voting.json';
import tokenArtifacts from '../contracts/CorrToken.json';

const Voting = contract(votingArtifacts);
const Token = contract(tokenArtifacts);
const {accounts} = web3.eth;
Voting.setProvider(web3.currentProvider);
Token.setProvider(web3.currentProvider);

const register = async name => {
      const nameInBytes = web3.fromUtf8(name);
      const ctVoting = await Voting.deployed();
      const addresses = await ctVoting.getVoterAddresses();
      const availables = difference(accounts, addresses);
      // 1 because  first one is admin
      const from = availables[1];
      if (! from) {
            throw new Error(ms.noMoreRegistrationAllowed);
      }
      await ctVoting.registerVoter(nameInBytes, {from, gas: 150000});
      return from;
};

const login = async name => {
      const  ctVoting = await Voting.deployed();
      const [record, address, user] =  await ctVoting.voterDetails(name);
      const registered = web3.toUtf8(user) === name;
      return {
            record: registered ? record.map(e => e.toNumber()) : {},
            address: registered ? address : await register(name)
      }
};

const buyTokens = async (nb, {name, address}) => {
      const  ctVoting = await Voting.deployed();
      const value = web3.toWei('0.000000001', 'ether') * nb;
      await ctVoting.buyTokens(name, {from: address, value});
};

const totalVotesFor = async name => {
      const  ctVoting = await Voting.deployed();
      const vote = await ctVoting.totalVotesFor(name);
      return vote.toString();
};

const voteFor = async (candidate, {name, address}) => {
      const  tokenInst = await Token.deployed();
      const ctVoting = await Voting.deployed();
      await ctVoting.voteForCandidate(
            web3.fromUtf8(candidate),
            web3.fromUtf8(name),
            {from: address, gas: 200000}
      );
};

export default {
      login,
      voteFor,
      buyTokens,
      totalVotesFor,
};