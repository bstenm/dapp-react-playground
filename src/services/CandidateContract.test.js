import cf from '../config';
import web3 from './Web3';
import {Candidates} from './ContractsInstances';
import {addCandidateInfo, getCandidateInfo} from './CandidateContract';

jest.mock('./ContractsInstances');

describe('addCandidateInfo', () => {

      it('Saves the new info into the blockchain', async () => {
            let addInfoSpy = jest.fn();
            Candidates.deployed.mockImplementation(() => ({
                  addInfo: addInfoSpy
            }));
            await addCandidateInfo({
                  title: 'Title',
                  fileHash: 'fileHash',
                  candidate: 'Trump',
                  description: 'description'
            }, '0xUserAddress');
            expect(addInfoSpy.mock.calls.length).toEqual(1);
            expect(addInfoSpy.mock.calls[0][0]).toEqual('Trump');
            expect(addInfoSpy.mock.calls[0][1]).toEqual('Title');
            expect(addInfoSpy.mock.calls[0][2]).toEqual('description');
            expect(addInfoSpy.mock.calls[0][3]).toEqual('fileHash');
            expect(addInfoSpy.mock.calls[0][4].from).toEqual('0xUserAddress');
            expect(addInfoSpy.mock.calls[0][4].gas).toEqual(cf.gas.addInfo);
      });
});

describe('getCandidateInfo', () => {

      it('Fetches the candidate\'s info from the blockchain', async () => {
            Candidates.deployed.mockImplementation(() => ({
                  getInfo: (name, i) => [
                        ["title1", 'description1', 'null'],
                        ["title2", 'description2', 'file2']
                  ].map(e1 => e1.map(e2 => web3.fromUtf8(e2)))[i]
            }));
            const infos = await getCandidateInfo('Trump');
            expect(infos).toEqual([
                  {title: "title1", description: 'description1', fileHash: null},
                  {title: "title2", description: 'description2', fileHash: 'file2'}
            ]);
      });
});
