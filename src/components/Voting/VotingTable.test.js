import React from 'react';
import { Table } from 'react-bootstrap';
import { shallow } from 'enzyme';
import VotingTable from './VotingTable';
import CandidateListRow from '../CandidateListRow';

describe('(Component) VotingTable', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  candidates: [
                        { name: 'Nick', vote: '0' },
                        { name: 'Jason', vote: '3' },
                        { name: 'Joanna', vote: '49' }
                  ],
                  loading: false,
                  voteFor: jest.fn()
            };
            wrapper = shallow(<VotingTable {...props} />);
      });

      it('Displays a VotingTable', () => {
            expect(wrapper.find('.VotingTable')).toHaveLength(1);
      });

      it('Displays a Table component', () => {
            expect(wrapper.find(Table)).toHaveLength(1);
      });

      it('Displays a CandidateListRow component for each candidate', () => {
            expect(wrapper.find(CandidateListRow)).toHaveLength(3);
      });

      it('Displays the CandidateListRow components alphabetically', () => {
            expect(
                  wrapper
                        .find(CandidateListRow)
                        .at(0)
                        .props().candidate.name
            ).toEqual('Jason');
            expect(
                  wrapper
                        .find(CandidateListRow)
                        .at(2)
                        .props().candidate.name
            ).toEqual('Nick');
      });

      it('Passesthe loading state as prop to the CandidateListRow components', () => {
            expect(
                  wrapper
                        .find(CandidateListRow)
                        .at(0)
                        .props().loading
            ).toEqual(false);
            wrapper.setProps({ loading: true });
            expect(
                  wrapper
                        .find(CandidateListRow)
                        .at(0)
                        .props().loading
            ).toEqual(true);
      });
});
