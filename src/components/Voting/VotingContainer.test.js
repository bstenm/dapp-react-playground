import React from 'react';
import {shallow} from 'enzyme';
import Container from './VotingContainer';
import Component from './Voting';
import {VotingContainer} from './VotingContainer';

describe( '(Container) Voting', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  dispatch: {
                        alert: {
                              message: jest.fn()
                        },
                        user: {
                              addVoteToRecord : jest.fn(),
                              updateTokenCount: jest.fn()
                        },
                        candidates: {
                              addVote: jest.fn(),
                              getVotes: jest.fn()
                        }
                  },
                  requesting: false,
                  user: {tokens: 50},
                  candidates: [
                        {name: 'Jason', vote: '3'},
                        {name: 'Joanna', vote: '49'},
                        {name: 'Nick', vote: '0'}
                  ]
            };
            wrapper = shallow(<VotingContainer {...props} />);
      });

      test( 'Displays a Voting component', () => {
            expect( wrapper.find(Component).length ).toEqual(1);
      });

      test('Gets the votes data on initialisation', () => {
            expect(props.dispatch.candidates.getVotes.mock.calls.length).toEqual(1);
      });

      // prop: requesting
      test('Passes requesting prop to component', () => {
            expect(wrapper.find(Component).props().requesting).toEqual(false);
            wrapper.setProps({requesting: true});
            expect(wrapper.find(Component).props().requesting).toEqual(true);
      });

      // prop: candidates
      test('Passes candidates to component', () => {
            expect(wrapper.find(Component).props().candidates).toEqual(props.candidates);
      });

      test('Disables voting while requesting', () => {
            wrapper.setProps({requesting: true});
            wrapper.find(Component).props().voteFor('name');
            expect(props.dispatch.candidates.addVote.mock.calls.length).toEqual(0);
            expect(props.dispatch.user.addVoteToRecord.mock.calls.length).toEqual(0);
            expect(props.dispatch.user.updateTokenCount.mock.calls.length).toEqual(0);
      });

      test('Disables voting and emit alert if not enough funds', () => {
            wrapper.setProps({user: {tokens: 0}});
            wrapper.find(Component).props().voteFor('name');
            expect(props.dispatch.alert.message.mock.calls.length).toEqual(1);
            expect(props.dispatch.candidates.addVote.mock.calls.length).toEqual(0);
            expect(props.dispatch.user.addVoteToRecord.mock.calls.length).toEqual(0);
            expect(props.dispatch.user.updateTokenCount.mock.calls.length).toEqual(0);
      });

      // prop: voteFor
      test( 'Passes voteFor cb to update user and candidates state to component', () => {
            wrapper.find(Component).props().voteFor('name');
            expect(props.dispatch.candidates.addVote.mock.calls.length).toEqual(1);
            expect(props.dispatch.candidates.addVote.mock.calls[0][0]).toEqual('name');
            expect(props.dispatch.user.addVoteToRecord.mock.calls.length).toEqual(1);
            expect(props.dispatch.user.addVoteToRecord.mock.calls[0][0]).toEqual({name: 'name', vote: 1});
            expect(props.dispatch.user.updateTokenCount.mock.calls.length).toEqual(1);
            expect(props.dispatch.user.updateTokenCount.mock.calls[0][0]).toEqual(-1);
      });
});

