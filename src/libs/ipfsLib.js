import cf from '../config';
import ipfsApi from 'ipfs-api';

const {ipfsConfig} = cf;
const ipfs = new ipfsApi(ipfsConfig);

export const uploadToIpfs = file => {
      return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                  const buffer = Buffer(reader.result);
                  ipfs.files.add(buffer, (e, files) => {
                        if (e) reject(e);
                        resolve(files[0].hash);
                  });
            };
      });
};
