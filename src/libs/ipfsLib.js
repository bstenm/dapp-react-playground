import ipfs from '../services/ipfs';

export default file =>
      new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                  const buffer = Buffer.from(reader.result);
                  ipfs.files.add(buffer, (e, files) => {
                        if (e) reject(e);
                        else resolve(files[0].hash);
                  });
            };
      });
