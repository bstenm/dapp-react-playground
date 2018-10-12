import web3 from '../services/Web3';
import contract from 'truffle-contract';
import tokenArtifacts from '../contracts/CorrToken.json';
import votingArtifacts from '../contracts/Voting.json';
import tokenSaleArtifacts from '../contracts/CorrTokenSale.json';
import candidatesArtifacts from '../contracts/Candidates.json';

const TokenContract = contract(tokenArtifacts);
const VotingContract = contract(votingArtifacts);
const TokenSaleContract = contract(tokenSaleArtifacts);
const CandidatesContract = contract(candidatesArtifacts);
VotingContract.setProvider(web3.currentProvider);
TokenContract.setProvider(web3.currentProvider);
TokenSaleContract.setProvider(web3.currentProvider);
CandidatesContract.setProvider(web3.currentProvider);

export const Token = TokenContract;
export const Voting = VotingContract;
export const TokenSale = TokenSaleContract;
export const Candidates = CandidatesContract;