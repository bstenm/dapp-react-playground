import cf from '../config';
import web3 from './Web3';
import {Candidates} from './ContractsInstances';

export const addCandidateInfo = async (payload, from) => {
      const gas = cf.gas.addInfo;
      const {addInfo} = await Candidates.deployed();
      const {candidate, title, description, fileHash} = payload;
      await addInfo(candidate, title, description, fileHash, { from, gas });

};

export const getCandidateInfo = async (name) => {
      let i = 0, raw, data, info = [];
      const {getInfo} = await Candidates.deployed();
      do {
            raw = await getInfo(name, i++);
            data = (raw || []).map(e => web3.toUtf8(e));
            const [ title, description, ipfsHash ] = data;
            const fileHash = ipfsHash === 'null' ? null : ipfsHash;
            if (title) info.push({ title, description, fileHash });
            // data[0] is title
      } while (!! data[0]);
      return info;
};
