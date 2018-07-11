import web3 from '../services/Web3';
import contract from 'truffle-contract';
import tokenArtifacts from '../contracts/CorrToken.json';
import votingArtifacts from '../contracts/Voting.json';
import tokenSaleArtifacts from '../contracts/CorrTokenSale.json';

const Token = contract(tokenArtifacts);
const Voting = contract(votingArtifacts);
const TokenSale = contract(tokenSaleArtifacts);
const {accounts} = web3.eth;
Token.setProvider(web3.currentProvider);
Voting.setProvider(web3.currentProvider);
TokenSale.setProvider(web3.currentProvider);

export default {TokenSale, Voting, Token};