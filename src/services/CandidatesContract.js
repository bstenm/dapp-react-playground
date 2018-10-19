import cf from '../config';
import web3 from './Web3';
import {Candidates} from './ContractsInstances';

export const getCandidateInfo = async (name) => {
      let i = 0, raw, data, info = [];
      const {getCandidateInfoAt} = await Candidates.deployed();
      do {
            raw = await getCandidateInfoAt(name, i++);
            data = (raw || []).map(e => web3.toUtf8(e));
            const [ title, description, ipfsHash ] = data;
            const fileHash = ipfsHash === 'null' ? null : ipfsHash;
            if (title) info.push({ title, description, fileHash });
            // data[0] is title
      } while (!! data[0]);
      return info;
};

export const getTotalVotesFor = async (name) => {
      const { candidateVotes } = await Candidates.deployed();
      const vote = await candidateVotes(name);
      return vote.toString();
};

export const addCandidateInfo = async (payload, from) => {
      const { candidate, title, description, attachmentHash } = payload;
      const { addInfo } = await Candidates.deployed();
      const gas = cf.gas.addInfo;
      await addInfo(candidate, title, description, attachmentHash, {from, gas});
};

export const addVoteFor = async (candidate, from) => {
      const ct = await Candidates.deployed();
      await ct.addVoteFor(candidate, {from});
};