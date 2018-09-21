import candidates from './candidates';

const { updateList, updateInfo } = candidates.reducers;

let initialState = [
      {name: 'Hilary', vote: '0', info: []},
      {name: 'Jill', vote: '0', info: []},
      {name: 'Trump', vote: '0', info: []},
];

  describe('(Reducer) updateList', () => {

      it('Updates the data keys of the list of candidates', () => {
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
});

describe('(Reducer) updateInfo', () => {

      it('Updates the data keys of the list of candidates', () => {
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