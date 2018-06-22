import React from 'react';
import SignIn from '../SignIn';
import {shallow} from 'enzyme';
import Component from './Header';
import UserAccount from '../UserAccount';
import PurchaseTokens from '../PurchaseTokens';
import {Nav, Navbar, NavItem, OverlayTrigger, Popover} from 'react-bootstrap';


describe( '(Component) Header', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  login: jest.fn(),
                  buyTokens: jest.fn(),
                  userAccount: {tokens: 10, votingRecord: {Jill: 100}}
            };
            wrapper = shallow(<Component {...props} />);
      });

      test('Displays a Header', () => {
            expect(wrapper.find('.Header').length).toEqual(1);
      });

      test( 'Displays a Navbar component', () => {
            expect( wrapper.find(Navbar).length ).toEqual(1);
      });

      test( 'Displays a Navbar.Brand component', () => {
            expect(wrapper.find(Navbar.Brand).length).toEqual(1);
      });

      test('Displays a Popover component with a PurchaseTokens component as child', () => {
            const {overlay} = wrapper.find(OverlayTrigger).at(0).props();
            const popOver = shallow(overlay);
            expect(popOver.instance() instanceof Popover).toBe(true);
            expect(popOver.find(PurchaseTokens).length).toEqual(1);
      });

      // prop: onSubmit
      test('Passes the cb to buy tokens to the PurchaseTokens component', () => {
            const {overlay} = wrapper.find(OverlayTrigger).at(0).props();
            const popOver = shallow(overlay);
            popOver.find(PurchaseTokens).props().onSubmit(10);
            expect(props.buyTokens.mock.calls.length).toEqual(1);
            expect(props.buyTokens.mock.calls[0][0] ).toEqual(10);
      });

      test('Displays a popover containing the user\'s account', () => {
            const {overlay} = wrapper.find(OverlayTrigger).at(1).props();
            const popOver = shallow(overlay);
            expect(popOver.instance() instanceof Popover).toBe(true);
            expect(popOver.find(UserAccount).length).toEqual(1);
            expect(popOver.find(UserAccount).props().account).toEqual(props.userAccount);
      });

      test('Displays a SignIn component', () => {
            expect(wrapper.find(SignIn).length).toEqual(1);
      });

      // prop: show
      test('Passes show prop to component to show sign in if nu ser name set', () => {
            expect(wrapper.find(SignIn).props().show).toEqual(true);
            wrapper.setProps({userAccount: {name: 'Jennifer'}});
            expect(wrapper.find(SignIn).props().show).toEqual(false);
      });

      // prop: login
      test( 'Passes login cb to sign in component', () => {
            wrapper.find(SignIn).props().login('Jennifer');
            expect(props.login.mock.calls.length).toEqual(1);
            expect(props.login.mock.calls[0][0]).toEqual('Jennifer');
      });
});

