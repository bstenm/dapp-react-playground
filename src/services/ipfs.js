import IpfsApi from 'ipfs-api';
import cf from '../config';

export default new IpfsApi(cf.ipfsConfig);
