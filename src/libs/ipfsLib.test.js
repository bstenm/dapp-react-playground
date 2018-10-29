import ipfs from '../services/ipfs';
import uploadToIpfs from './ipfsLib';

jest.mock('../services/ipfs.js');

describe('(Lib) ipfsLib', () => {
      it('Attempts to upload a file to IPFS and returns its hash if successful', async () => {
            ipfs.files.add.mockImplementation((buffer, cb) =>
                  cb(null, [{ hash: 'hash' }])
            );
            const file = new File([''], 'filename');
            const res = await uploadToIpfs(file);
            expect(res).toEqual('hash');
      });

      it('Attempts to upload a file to IPFS and throws the error if unsuccessful', async () => {
            try {
                  ipfs.files.add.mockImplementation((buffer, cb) =>
                        cb('error')
                  );
                  const file = new File([''], 'filename');
                  await uploadToIpfs(file);
            } catch (e) {
                  expect(e).toEqual('error');
            }
      });
});
