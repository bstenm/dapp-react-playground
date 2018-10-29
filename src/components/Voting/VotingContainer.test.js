import React from 'react';
import { shallow } from 'enzyme';
import Component from './CandidateList';
import { VotingContainer } from './VotingContainer';

describe('(Container) Voting', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  dispatch: {
                        alert: {
                              error: jest.fn()
                        },
                        user: {
                              addVoteToRecord: jest.fn()
                        },
                        candidates: {
                              addVote: jest.fn(),
                              fetchVotes: jest.fn()
                        }
                  },
                  loading: false,
                  user: { tokens: 50 },
                  candidates: [
                        { name: 'Jason', vote: '3' },
                        { name: 'Joanna', vote: '49' },
                        { name: 'Nick', vote: '0' }
                  ]
            };
            wrapper = shallow(<VotingContainer {...props} />);
      });

      it('Displays a Voting component', () => {
            expect(wrapper.find(Component)).toHaveLength(1);
      });

      it('Gets the votes data on initialisation', () => {
            expect(
                  props.dispatch.candidates.fetchVotes.mock.calls
            ).toHaveLength(1);
      });

      // prop: loading
      it('Passes loading prop to component', () => {
            expect(wrapper.find(Component).props().loading).toEqual(false);
            wrapper.setProps({ loading: true });
            expect(wrapper.find(Component).props().loading).toEqual(true);
      });

      // prop: candidates
      it('Passes candidates to component', () => {
            expect(wrapper.find(Component).props().candidates).toEqual(
                  props.candidates
            );
      });

      // prop: voteFor
      it('Passes voteFor cb to update user and candidates state to component', () => {
            wrapper
                  .find(Component)
                  .props()
                  .voteFor('name');
            expect(props.dispatch.candidates.addVote.mock.calls).toHaveLength(
                  1
            );
            expect(props.dispatch.candidates.addVote.mock.calls[0][0]).toEqual(
                  'name'
            );
            expect(props.dispatch.user.addVoteToRecord.mock.calls).toHaveLength(
                  1
            );
            expect(
                  props.dispatch.user.addVoteToRecord.mock.calls[0][0]
            ).toEqual('name');
      });

      // prop: voteFor
      it('Disables voting while loading', () => {
            wrapper.setProps({ loading: true });
            wrapper
                  .find(Component)
                  .props()
                  .voteFor('name');
            expect(props.dispatch.candidates.addVote.mock.calls).toHaveLength(
                  0
            );
            expect(props.dispatch.user.addVoteToRecord.mock.calls).toHaveLength(
                  0
            );
      });

      // prop: voteFor
      it('Disables voting and emit alert if not enough funds', () => {
            wrapper.setProps({ user: { tokens: 0 } });
            wrapper
                  .find(Component)
                  .props()
                  .voteFor('name');
            expect(props.dispatch.alert.error.mock.calls).toHaveLength(1);
            expect(props.dispatch.candidates.addVote.mock.calls).toHaveLength(
                  0
            );
            expect(props.dispatch.user.addVoteToRecord.mock.calls).toHaveLength(
                  0
            );
      });
});
