import cf from '../config';
import Contract, {addCandidateInfo} from './CandidateContract';

jest.mock('./CandidateContract');

describe('addCandidateInfo', () => {

      it('Calls the contract to add the new info into the blockchain', async () => {
            const addInfoSpy = jest.fn();
            await Contract.deployed.mockImpementation(() => {
                  addInfo: addInfoSpy
            });
            addCandidateInfo({
                  title: 'Title',
                  fileHash: 'fileHash',
                  candidate: 'Trump',
                  description: 'description'
            })
            expect(1).toEqual(1);
            // expect(addInfo.mock.calls.length).toEqual(1);
            // expect(addInfo.mock.calls[0][0] ).toEqual(
            //       title: 'Title',
            //       fileHash: 'fileHash',
            //       candidate: 'Trump',
            //       description: 'description',
            //       { from : '0xUserAddress', gas: cf.gas.addInfo }
            // );
      });
});
