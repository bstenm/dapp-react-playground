import cf from '../config';
import web3 from './Web3';
import {Users} from './ContractsInstances';
import difference from 'lodash/difference';

export const registerUser = async (from) => {
      const {register} = await Users.deployed();
      const gas = cf.gas.registration;
      await register({from, gas});
}

export const getUserData = async (userAddress) => {
      const  {userData} = await Users.deployed();
      const [record, address] =  await userData(userAddress);
      if (address.slice(0, 6) === '0x0000') return {}; // * exit if not found *
      const votingRecord = cf.candidates.reduce((r, v, k) => {
            r[v] = record[k].toNumber();
            return r;
      }, {});
      return { votingRecord, address };
};

export const getContractAddress = async () => {
      const ct = await Users.deployed();
      return ct.address;
};