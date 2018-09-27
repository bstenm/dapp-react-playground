import {Link} from 'react-router-dom';
import React from 'react';
import {Table} from 'react-bootstrap';
import {routes} from '../../config';
import {shallow} from 'enzyme';
import CandidateList from './CandidateList';
import CandidateListRow from '../CandidateListRow';

describe('(Component) CandidateList', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  candidates: [
                        {name: 'Nick', vote: '0'},
                        {name: 'Jason', vote: '3'},
                        {name: 'Joanna', vote: '49'},
                  ],
                  loading: false,
                  voteFor: jest.fn()
            };
            wrapper = shallow( <CandidateList { ...props } />);
      });

      it( 'Displays a CandidateList', () => {
            expect( wrapper.find( '.CandidateList' ).length ).toEqual( 1 );
      });

      it('Displays a Table component', () => {
            expect(wrapper.find(Table).length).toEqual(1);
      });

      it('Displays a CandidateListRow component for each candidate', () => {
            expect(wrapper.find(CandidateListRow).length).toEqual(3);
      });

      it('Displays the CandidateListRow components alphabetically', () => {
            expect(wrapper.find(CandidateListRow).at(0).props().candidate.name).toEqual('Jason');
            expect(wrapper.find(CandidateListRow).at(2).props().candidate.name).toEqual('Nick');
      });

      it('Passesthe loading state as prop to the CandidateListRow components', () => {
            expect(wrapper.find(CandidateListRow).at(0).props().loading).toEqual(false);
            wrapper.setProps({ loading: true });
            expect(wrapper.find(CandidateListRow).at(0).props().loading).toEqual(true);
      });
});

