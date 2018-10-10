import web3 from './Web3';
import contract from 'truffle-contract';
import contractArtifacts from '../contracts/Candidates.json';

const Contract = contract(contractArtifacts);

Contract.setProvider(web3.currentProvider);

export const addCandidateInfo = async (payload, from) => {
      const gas = 500000;
      const {addInfo} = await Contract.deployed();
      const {candidate, title, description, fileHash} = payload;
      await addInfo(candidate, title, description, fileHash, { from, gas });
};

export const getCandidateInfo = async (name) => {
      let i = 0, raw, data, info = [];
      const contract = await Contract.deployed();
      do {
            raw = await contract.getInfo(name, i++);
            data = (raw || []).map(e => web3.toUtf8(e));
            const [ title, description, ipfsHash ] = data;
            const fileHash = ipfsHash === 'null' ? null : ipfsHash;
            if (title) info.push({ title, description, fileHash });
            // data[0] is title
      } while (!! data[0]);
      return info;
}