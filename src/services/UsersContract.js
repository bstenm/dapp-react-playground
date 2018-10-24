import cf from '../config';
import {Users} from './ContractsInstances';

export const registerUser = async (from) => {
      const {register} = await Users.deployed();
      const gas = cf.gas.registration;
      await register({from, gas});
}

export const getUserData = async (userAddress) => {
      const  {userData} = await Users.deployed();
      const [record, address] =  await userData(userAddress);
      if (address.slice(0, 6) === '0x0000') {
            return { votingRecord: {}};  // * exit if not found *
      }
      const votingRecord = record.reduce((r, v, k) => {
            const key = cf.candidates[k];
            r[key] = v.toNumber();
            return r;
      }, {});
      return { votingRecord, userAddress };
};

export const getContractAddress = async () => {
      const ct = await Users.deployed();
      return ct.address;
};

export const addVoteFor = async (name, from) => {
      // we pass the index rather than the name of the candidaterelated
      // to the issue about not being able to return tuples form solidity fn
      const idx = cf.candidates.indexOf(name);
      const gas = cf.gas.vote;
      const {updateVotingRecord} = await Users.deployed();
      await updateVotingRecord(idx, {from, gas});
};