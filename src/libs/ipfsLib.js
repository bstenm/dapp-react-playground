import { ipfs } from '../services/ipfs';

export const uploadToIpfs = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
            const buffer = Buffer(reader.result);
            ipfs.files.add(buffer, (e, files) => {
                  if (e) return reject(e);
                  resolve(files[0].hash);
            });
      };
});
