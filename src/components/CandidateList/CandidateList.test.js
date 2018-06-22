import React from 'react';
import {shallow} from 'enzyme';
import {Glyphicon} from 'react-bootstrap';
import Component from './CandidateList';

describe('(Component) CandidateList', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  candidates: [
                        {name: 'Nick', vote: '0'},
                        {name: 'Jason', vote: '3'},
                        {name: 'Joanna', vote: '49'},
                  ],
                  requesting: false,
                  voteFor: jest.fn()
            };
            wrapper = shallow( <Component { ...props } />);
      });

      test( 'Displays a CandidateList', () => {
            expect( wrapper.find( '.CandidateList' ).length ).toEqual( 1 );
      });

      test('Displays one table row for each candidate alphabetically', () => {
            // one for the headers
            expect(wrapper.find('tr').length).toEqual(4);
            expect(wrapper.find('tr').at(1).find('td').at(0).text()).toEqual('Jason');
            expect(wrapper.find('tr').at(1).find('td').at(1).text()).toEqual('3');
            expect(wrapper.find('tr').at(3).find('td').at(0).text()).toEqual('Nick');
            expect(wrapper.find('tr').at(3).find('td').at(1).text()).toEqual("0");
      });

      test('Allows user to add vote for each candidate', () => {
            const icon = i => wrapper.find('tr').at(i).find('td').at(2).find(Glyphicon);
            expect(icon(1).length).toEqual(1);
            icon(1).props().onClick();
            expect(props.voteFor.mock.calls.length).toEqual(1);
            expect(props.voteFor.mock.calls[0][0] ).toEqual('Jason');
            expect(icon(2).length).toEqual(1);
            icon(2).props().onClick();
            expect(props.voteFor.mock.calls.length).toEqual(2);
            expect(props.voteFor.mock.calls[1][0] ).toEqual('Joanna');
      });

      test('Hides the voting button while requesting', () => {
            wrapper.setProps({requesting: true});
            const icon = wrapper.find('tr').find('td').at(2).find(Glyphicon);
            expect(icon.length).toEqual(0);
      });
});

