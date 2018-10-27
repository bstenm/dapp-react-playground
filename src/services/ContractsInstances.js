import contract from 'truffle-contract';
import web3 from './Web3';
import usersArtifacts from '../contracts/Users.json';
import tokenArtifacts from '../contracts/CorrToken.json';
import tokenSaleArtifacts from '../contracts/CorrTokenSale.json';
import candidatesArtifacts from '../contracts/Candidates.json';
import userActionsArtifacts from '../contracts/UserActions.json';

const UsersContract = contract(usersArtifacts);
const TokenContract = contract(tokenArtifacts);
const TokenSaleContract = contract(tokenSaleArtifacts);
const CandidatesContract = contract(candidatesArtifacts);
const UserActionsContract = contract(userActionsArtifacts);
UsersContract.setProvider(web3.currentProvider);
TokenContract.setProvider(web3.currentProvider);
TokenSaleContract.setProvider(web3.currentProvider);
CandidatesContract.setProvider(web3.currentProvider);
UserActionsContract.setProvider(web3.currentProvider);

export const Users = UsersContract;
export const Token = TokenContract;
export const TokenSale = TokenSaleContract;
export const Candidates = CandidatesContract;
export const UserActions = UserActionsContract;
