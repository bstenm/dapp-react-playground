import React from 'react';
import {shallow} from 'enzyme';
import Container from './HeaderContainer';
import Component from './Header';
import {HeaderContainer} from './HeaderContainer';

describe( '(Container) Header', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  user: {name: 'Joanna', tokens: 10},
                  login: jest.fn(),
                  logout: jest.fn(),
                  buyTokens: jest.fn()
            };
            wrapper = shallow( <HeaderContainer {...props} />);
      });

      test( 'Displays a Header component', () => {
            expect( wrapper.find(Component).length ).toEqual(1);
      });

      // prop: buyTokens
      test( 'Passes cb to buy tokens to component', () => {
            wrapper.find(Component).props().buyTokens(10);
            expect(props.buyTokens.mock.calls.length).toEqual(1);
            expect(props.buyTokens.mock.calls[0][0]).toEqual(10);
      });

      // prop: userAccount
      test('Passes userAccount to component', () => {
            expect(wrapper.find(Component).props().userAccount).toEqual(props.user);
      });

      // prop: login
      test( 'Passes login cb to component', () => {
            wrapper.find(Component).props().login('Jennifer');
            expect(props.login.mock.calls.length).toEqual(1);
            expect(props.login.mock.calls[0][0]).toEqual('Jennifer');
      });

      // prop: logout
      test('Passes logout cb to component', () => {
            wrapper.find(Component).props().logout();
            expect(props.logout.mock.calls.length).toEqual(1);
      });
});

