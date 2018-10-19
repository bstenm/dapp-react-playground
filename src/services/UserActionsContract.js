import cf from '../config';
import {UserActions} from './ContractsInstances';

// [TOREMOVE]: won't need it when Solidity contract takes care of setting the proxy approval
export const getUsersActionsContractAddress = async () => {
      const ct = await UserActions.deployed();
      return ct.address;
};

export const voteFor = async (candidate, name, from) => {
      const  {voteForCandidate} = await UserActions.deployed();
      const gas = cf.gas.vote;
      await voteForCandidate(candidate, name, {from, gas});
};

export const addCandidateInfo = async (payload, from) => {
      const gas = cf.gas.addInfo;
      const {addCandidateInfo} = await UserActions.deployed();
      const {candidate, title, description, fileHash} = payload;
      await addCandidateInfo(candidate, title, description, fileHash, {from, gas});
};