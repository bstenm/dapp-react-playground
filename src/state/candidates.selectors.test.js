import candidates from './candidates';

const { getInfoFor } = candidates.selectors;

const data = [
      { name: 'Hilary', vote: '0', info: [
            { title: 'title1', description: 'description1' },
            { title: 'title2', description: 'description2' },
      ]},
      { name: 'Jill', vote: '0', info: [
            { title: 'title3', description: 'description3' }
      ]},
      { name: 'Trump', vote: '0', info: []},
];

describe('(Selector) candidates', () => {

      it('(getInfoFor) Returns the infos for a specific candidate', () => {
            const result = getInfoFor()({ candidates: data })('Jill');
            expect(result).toEqual([
                  { title: 'title3', description: 'description3' }
            ]);
      });

      it('(getInfoFor) Returns an empty array if candidate not found in data', () => {
            const result = getInfoFor()({ candidates: data })('Unknown');
            expect(result).toEqual([]);
      });
});