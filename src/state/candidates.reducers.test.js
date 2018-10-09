import candidates from './candidates';

const { updateList, updateInfo } = candidates.reducers;

let initialState = [
      {name: 'Hilary', vote: '0', info: []},
      {name: 'Jill', vote: '0', info: []},
      {name: 'Trump', vote: '0', info: []},
];

describe('(Reducer) candidates', () => {

      it('(updateList) Updates the data keys of the list of candidates', () => {
            const result = updateList(initialState, [
                  {name: 'Hilary', vote: '2', info: ['some info']},
                  {name: 'Trump', vote:'3'}
            ]);
            expect(result).toEqual([
                  {name: 'Hilary', vote: '2', info: ['some info']},
                  {name: 'Jill', vote: '0', info: []},
                  {name: 'Trump', vote: '3', info: []}
            ]);
      });

      it('(updateInfo) Adds the data to the info key for the candidate passed', () => {
            initialState = [
                  {name: 'Hilary', vote: '2', info: ['some info']},
                  {name: 'Jill', vote: '0', info: []},
                  {name: 'Trump', vote: '0', info: []}
            ]
            const result = updateInfo(initialState, {
                  name: 'Hilary',
                  info: 'some other info'
            });
            expect(result).toEqual([
                  {name: 'Hilary', vote: '2', info: ['some info', 'some other info']},
                  {name: 'Jill', vote: '0', info: []},
                  {name: 'Trump', vote: '0', info: []}
            ]);
      });
});