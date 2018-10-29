import React from 'react';
import { shallow } from 'enzyme';
import VotingTable from './VotingTable';
import { VotingTableContainer } from './VotingTableContainer';

describe('(Container) VotingTable', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  showError: jest.fn(),
                  addVote: jest.fn(),
                  fetchVotes: jest.fn(),
                  loading: false,
                  user: { tokens: 50 },
                  candidates: [
                        { name: 'Jason', vote: '3' },
                        { name: 'Joanna', vote: '49' },
                        { name: 'Nick', vote: '0' }
                  ]
            };
            wrapper = shallow(<VotingTableContainer {...props} />);
      });

      it('Displays a VotingTable component', () => {
            expect(wrapper.find(VotingTable)).toHaveLength(1);
      });

      it('Gets the votes data on initialisation', () => {
            expect(props.fetchVotes.mock.calls).toHaveLength(1);
      });

      // prop: loading
      it('Passes loading prop to component', () => {
            expect(wrapper.find(VotingTable).props().loading).toEqual(false);
            wrapper.setProps({ loading: true });
            expect(wrapper.find(VotingTable).props().loading).toEqual(true);
      });

      // prop: candidates
      it('Passes candidates to component', () => {
            expect(wrapper.find(VotingTable).props().candidates).toEqual(
                  props.candidates
            );
      });

      // prop: voteFor
      it('Passes voteFor cb to update user and candidates state to component', () => {
            wrapper
                  .find(VotingTable)
                  .props()
                  .voteFor('name');
            expect(props.addVote.mock.calls).toHaveLength(1);
            expect(props.addVote.mock.calls[0][0]).toEqual('name');
      });

      // prop: voteFor
      it('Disables voting while loading', () => {
            wrapper.setProps({ loading: true });
            wrapper
                  .find(VotingTable)
                  .props()
                  .voteFor('name');
            expect(props.addVote.mock.calls).toHaveLength(0);
      });

      // prop: voteFor
      it('Disables voting and emit alert if not enough funds', () => {
            wrapper.setProps({ user: { tokens: 0 } });
            wrapper
                  .find(VotingTable)
                  .props()
                  .voteFor('name');
            expect(props.showError.mock.calls).toHaveLength(1);
            expect(props.addVote.mock.calls).toHaveLength(0);
      });
});
