import user from './user';

const initialState = {
      tokens: 9,
      votingRecord: { 'Petro Poroshenko': 10, 'Asif Ali Zardari': 2 }
};

describe('(Reducer) User state', () => {
      it('(setUserData) Updates the details of a user', () => {
            const newState = user.reducers.setUserData(initialState, {
                  tokens: 8,
                  votingRecord: {
                        'Petro Poroshenko': 1,
                        'Khalifa Bin Zayed': 20
                  }
            });
            expect(newState).toEqual({
                  tokens: 8,
                  votingRecord: {
                        'Petro Poroshenko': 1,
                        'Khalifa Bin Zayed': 20
                  }
            });
      });

      it('(setUserData) Adds tokens to user account', async () => {
            const newState = user.reducers.setUserData(initialState, {
                  tokens: 17
            });
            expect(newState).toEqual({
                  tokens: 17,
                  votingRecord: {
                        'Petro Poroshenko': 10,
                        'Asif Ali Zardari': 2
                  }
            });
      });

      it('(updateTokenCount) Updates tokens from the user account', async () => {
            const newState = user.reducers.updateTokenCount(initialState, -2);
            expect(newState).toEqual({
                  tokens: 7,
                  votingRecord: {
                        'Petro Poroshenko': 10,
                        'Asif Ali Zardari': 2
                  }
            });
      });

      it('(updateVotingRecord) Updates its voting record on vote event', async () => {
            const newState = user.reducers.updateVotingRecord(
                  initialState,
                  'Petro Poroshenko'
            );
            expect(newState).toEqual({
                  tokens: 9,
                  votingRecord: {
                        'Petro Poroshenko': 11,
                        'Asif Ali Zardari': 2
                  }
            });
      });

      it('(logout) Resets the state to empty object', async () => {
            expect(user.reducers.logout()).toEqual({});
      });
});
