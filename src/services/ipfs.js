import cf from '../config';
import IpfsApi from 'ipfs-api';

export const ipfs = new IpfsApi(cf.ipfsConfig);