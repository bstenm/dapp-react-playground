import {Link} from 'react-router-dom';
import React from 'react';
import {routes} from '../../config';
import {shallow} from 'enzyme';
import {Glyphicon} from 'react-bootstrap';
import CandidateListRow from './CandidateListRow';

describe('(Component) CandidateListRow', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  loading: false,
                  voteFor: jest.fn(),
                  candidate: {name: 'Jason', vote: '3'}
            };
            wrapper = shallow( <CandidateListRow { ...props } />);
      });

      it( 'Displays a CandidateListRow', () => {
            expect( wrapper.find( '.CandidateListRow' ).length ).toEqual( 1 );
      });

      it('Displays a table row with candidate name and vote number', () => {
            expect(wrapper.find('tr').length).toEqual(1);
            expect(wrapper.find('tr').text()).toContain('Jason');
            expect(wrapper.find('tr').text()).toContain('3');
      });

      it('Displays a Glpyhicon component if loading is off', () => {
            expect(wrapper.find(Glyphicon).length).toEqual(1);
            wrapper.setProps({ loading: true });
            expect(wrapper.find(Glyphicon).length).toEqual(0);
      });

      it('Passes a cb prop to handle voting event to Glyphicon component', () => {
            wrapper.find(Glyphicon).props().onClick();
            expect(props.voteFor.mock.calls.length).toEqual(1);
            expect(props.voteFor.mock.calls[0][0]).toEqual('Jason');
      });

      it('Displays a Link to add new info and one to show info for this candidate', () => {
            expect(wrapper.find(Link).length).toEqual(2);
            expect(wrapper.find(Link).at(0).props().to).toEqual(routes.candidateInfoList('Jason'));
            expect(wrapper.find(Link).at(1).props().to).toEqual(routes.candidateInfoForm('Jason'));
      });
});

