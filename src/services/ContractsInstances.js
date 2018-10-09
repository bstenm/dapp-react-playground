import web3 from '../services/Web3';
import contract from 'truffle-contract';
import tokenArtifacts from '../contracts/CorrToken.json';
import votingArtifacts from '../contracts/Voting.json';
import tokenSaleArtifacts from '../contracts/CorrTokenSale.json';
import candidatesArtifacts from '../contracts/Candidates.json';

const Token = contract(tokenArtifacts);
const Voting = contract(votingArtifacts);
const TokenSale = contract(tokenSaleArtifacts);
const Candidates = contract(candidatesArtifacts);
Voting.setProvider(web3.currentProvider);
Token.setProvider(web3.currentProvider);
TokenSale.setProvider(web3.currentProvider);
Candidates.setProvider(web3.currentProvider);

export default {TokenSale, Voting, Token, Candidates};