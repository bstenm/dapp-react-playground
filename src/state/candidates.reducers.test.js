import candidates from './candidates';

const { updateList, updateInfo } = candidates.reducers;

let initialState = [
      {name: 'Asif Ali Zardari', vote: '0', info: []},
      {name: 'Petro Poroshenko', vote: '0', info: []},
      {name: 'Khalifa Bin Zayed', vote: '0', info: []},
];

describe('(Reducer) candidates', () => {

      it('(updateList) Updates the data keys of the list of candidates', () => {
            const result = updateList(initialState, [
                  {name: 'Asif Ali Zardari', vote: '2', info: ['some info']},
                  {name: 'Khalifa Bin Zayed', vote:'3'}
            ]);
            expect(result).toEqual([
                  {name: 'Asif Ali Zardari', vote: '2', info: ['some info']},
                  {name: 'Petro Poroshenko', vote: '0', info: []},
                  {name: 'Khalifa Bin Zayed', vote: '3', info: []}
            ]);
      });

      it('(updateInfo) Sets the data to the info key for the candidate passed', () => {
            initialState = [
                  {name: 'Asif Ali Zardari', vote: '2', info: ['some info']},
                  {name: 'Petro Poroshenko', vote: '0', info: []},
                  {name: 'Khalifa Bin Zayed', vote: '0', info: []}
            ]
            const result = updateInfo(initialState, {
                  name: 'Asif Ali Zardari',
                  info: ['some other info']
            });
            expect(result).toEqual([
                  {name: 'Asif Ali Zardari', vote: '2', info: ['some other info']},
                  {name: 'Petro Poroshenko', vote: '0', info: []},
                  {name: 'Khalifa Bin Zayed', vote: '0', info: []}
            ]);
      });
});