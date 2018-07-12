import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

export const admin = web3.eth.accounts[0];

export default web3;