import ms from '../config/messages';
import user from './user';
import store from '../store';

const initialState = {
        name: 'Joanna'
      , tokens: 9
      , votingRecord: {Jill: 10, Hilary: 2}
};

describe('(Reducer) User state', () => {

      it('(updateUserDetails) Updates the details of a user', () => {
            const newState = user.reducers.updateUserDetails( initialState, {
                  name: 'Joanna',
                  tokens: 8,
                  votingRecord: {Jill: 1, Trump: 20}
            });
            expect(newState).toEqual({
                  name: 'Joanna',
                  tokens: 8,
                  votingRecord: {Jill: 1, Trump: 20}
            });
      });

      it('(updateUserDetails) Adds tokens to user account', async () => {
            const newState = user.reducers.updateUserDetails( initialState, { tokens: 17 });
            expect(newState).toEqual({
                  name: 'Joanna',
                  tokens: 17,
                  votingRecord: {Jill: 10, Hilary: 2}
            });
      });

      it('(updateTokenCount) Updates tokens from the user account', async () => {
            const newState = user.reducers.updateTokenCount( initialState, -2);
            expect(newState).toEqual({
                  name: 'Joanna',
                  tokens: 7,
                  votingRecord: {Jill: 10, Hilary: 2}
            });
      });

      it('(addVoteToRecord) Updates its voting record on vote event', async () => {
            const newState = user.reducers.addVoteToRecord( initialState, {name: 'Jill', vote: 2});
            expect(newState).toEqual({
                  name: 'Joanna',
                  tokens: 9,
                  votingRecord: {Jill: 12, Hilary: 2}
            });
      });

      it('(logout) Resets the state to empty object', async () => {
            expect(user.reducers.logout()).toEqual({});
      });
});
