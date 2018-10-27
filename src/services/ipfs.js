import IpfsApi from 'ipfs-api';
import cf from '../config';

export const ipfs = new IpfsApi(cf.ipfsConfig);
