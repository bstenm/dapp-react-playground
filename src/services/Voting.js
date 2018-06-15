
import Web3 from 'web3';
import contract from 'truffle-contract';
import difference from 'lodash/difference';
import votingArtifacts from '../build/contracts/Voting.json';

const Voting = contract(votingArtifacts);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const {accounts} = web3.eth;
Voting.setProvider(web3.currentProvider);

export default {

      login: async name => {
            const nameInBytes = web3.fromUtf8(name);
            const  contractInstance = await Voting.deployed();
            // first check if already registered
            let [tokens, record, address] =  await contractInstance.voterDetails(name);
            // [TODO]: why throws error when address is set?
            try {
                  if (! web3.toUtf8(address)) {
                        const addresses = await contractInstance.getVoterAddresses();
                        const availables = difference(accounts, addresses);
                        const available = availables[0];
                        await contractInstance.registerVoter(nameInBytes, {from: available, gas: 150000});
                        return {tokens: 0, name, address: accounts[1], record: {}};
                  }
            } catch(e) {
                  return {
                          tokens: tokens.toNumber()
                        , name
                        , address
                        , record: record.map(e => e.toNumber())
                  }
            }
      },

      // [TEMP]
      // userDetails: async () => {
      //       const  contractInstance = await Voting.deployed();
      //       const [tokens, votingRecord, name, id] = await contractInstance.voterDetails(user);
      //       return [
      //             tokens.toNumber(),
      //             votingRecord.map(e => e.toNumber()),
      //             name && web3.toUtf8(name),
      //             id.toNumber()
      //       ];
      // },

      buyTokens: async (nb, {name, address}) => {
            const  contractInstance = await Voting.deployed();
            const value = web3.toWei('0.000000001', 'ether') * nb;
            await contractInstance.buyTokens(name, {from: address, value});
      },

      totalVotesFor: async name => {
            const  contractInstance = await Voting.deployed();
            const vote = await contractInstance.totalVotesFor(name);
            return vote.toString();
      },

      voteFor: async (candidate, {name, address}) => {
            const  contractInstance = await Voting.deployed();
            await contractInstance.voteForCandidate(
                  web3.fromUtf8(name),
                  web3.fromUtf8(candidate),
                  {from: address}
            );
      }
}
