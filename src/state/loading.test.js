import loading from './loading';

describe('(Reducer) loading', () => {
      it('(start) Sets the loading state to true', () => {
            const newState = loading.reducers.start();
            expect(newState).toEqual(true);
      });

      it('(stop) Sets the loading state to false', () => {
            const newState = loading.reducers.stop();
            expect(newState).toEqual(false);
      });
});
