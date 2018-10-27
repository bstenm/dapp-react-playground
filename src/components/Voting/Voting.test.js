import React from 'react';
import { shallow } from 'enzyme';
import Component from './Voting';
import CandidateList from '../CandidateList';

describe('(Component) Voting', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  candidates: [
                        { name: 'Jason', vote: '3' },
                        { name: 'Joanna', vote: '49' },
                        { name: 'Nick', vote: '0' },
                  ],
                  loading: true,
                  voteFor: jest.fn(),
            };
            wrapper = shallow(<Component {...props} />);
      });

      test('Displays a Voting component', () => {
            expect(wrapper.find('.Voting')).toHaveLength(1);
      });

      test('Displays a CandidateList component', () => {
            expect(wrapper.find(CandidateList)).toHaveLength(1);
      });

      // prop: loading
      test('Passes the loading state to CandidateList component', () => {
            expect(wrapper.find(CandidateList).props().loading).toEqual(
                  props.loading,
            );
      });

      // prop: candidates
      test('Passes the candidates to CandidateList component', () => {
            expect(wrapper.find(CandidateList).props().candidates).toEqual(
                  props.candidates,
            );
      });

      // prop: voteFor
      test('Passes cb to vote for a candidate to CandidateList component', () => {
            wrapper
                  .find(CandidateList)
                  .props()
                  .voteFor();
            expect(props.voteFor.mock.calls).toHaveLength(1);
            expect(props.voteFor.mock.calls[0][0]).toEqual();
      });
});
