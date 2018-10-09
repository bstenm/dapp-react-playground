import ms from '../config/messages';
import alert from './alert';

const initialState = {};

describe('(Reducer) alert', () => {

      it('(silence) Sets the state to empty object', () => {
            const newState = alert.reducers.silence({
                  type: 'danger',
                  message: 'message'
            });
            expect(newState).toEqual({});
      });

      it('(success) Sets the alert message with a type "success"', async () => {
            const newState = alert.reducers.success( initialState,  'message');
            expect(newState).toEqual({
                  type: 'success',
                  message: 'message'
            });
      });

      it('(error) Sets the alert message with a type "danger"', async () => {
            const newState = alert.reducers.error( initialState,  'message');
            expect(newState).toEqual({
                  type: 'danger',
                  message: 'message'
            });
      });
});
