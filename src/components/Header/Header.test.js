import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import {
      Navbar,
      NavItem,
      OverlayTrigger,
      Popover,
      Glyphicon
} from 'react-bootstrap';
import SignIn from '../SignIn';
import Header from './Header';
import UserAccount from '../UserAccount';
import PurchaseTokens from '../PurchaseTokens';

describe('(Component) Header', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  user: {
                        tokens: 10,
                        address: '0xUserAddress',
                        votingRecord: { 'Khalifa Bin Zayed': 100 }
                  },
                  login: jest.fn(),
                  logout: jest.fn(),
                  buyTokens: jest.fn()
            };
            wrapper = shallow(<Header {...props} />);
      });

      it('Displays a Header', () => {
            expect(wrapper.find('.Header')).toHaveLength(1);
      });

      // Navbar
      it('Displays a Navbar component', () => {
            expect(wrapper.find(Navbar)).toHaveLength(1);
      });

      // Navbar.Brand
      it('Displays a Navbar.Brand component with a Glyphicon pointing to home', () => {
            expect(wrapper.find(Navbar.Brand)).toHaveLength(1);
            expect(wrapper.find(Navbar.Brand).find(Link)).toHaveLength(1);
            expect(
                  wrapper
                        .find(Navbar.Brand)
                        .find(Link)
                        .props().to
            ).toEqual('/');
            expect(
                  wrapper
                        .find(Navbar.Brand)
                        .find(Link)
                        .find(Glyphicon)
            ).toHaveLength(1);
      });

      // PurchaseTokens
      it('Displays a Popover component with a PurchaseTokens component as child', () => {
            const { overlay } = wrapper
                  .find(OverlayTrigger)
                  .at(0)
                  .props();
            const popOver = shallow(overlay);
            expect(popOver.instance() instanceof Popover).toBe(true);
            expect(popOver.find(PurchaseTokens)).toHaveLength(1);
      });

      // PurchaseTokens prop: onSubmit
      it('Passes the cb to buy tokens to the PurchaseTokens component', () => {
            const { overlay } = wrapper
                  .find(OverlayTrigger)
                  .at(0)
                  .props();
            const popOver = shallow(overlay);
            popOver
                  .find(PurchaseTokens)
                  .props()
                  .onSubmit(10);
            expect(props.buyTokens.mock.calls).toHaveLength(1);
            expect(props.buyTokens.mock.calls[0][0]).toEqual(10);
      });

      // UserAccount with prop: account
      it("Displays a popover containing the user's account", () => {
            const { overlay } = wrapper
                  .find(OverlayTrigger)
                  .at(1)
                  .props();
            const popOver = shallow(overlay);
            expect(popOver.instance() instanceof Popover).toBe(true);
            expect(popOver.find(UserAccount)).toHaveLength(1);
            expect(popOver.find(UserAccount).props().account).toEqual(
                  props.user
            );
      });

      it('Does not display any Popover components if no user address',  () => {
            wrapper.setProps({ user: {}});
            const overlayTrigger = wrapper.find(OverlayTrigger);
            expect(overlayTrigger).toHaveLength(0);
      });

      // Singin
      it('Displays a SignIn component', () => {
            expect(wrapper.find(SignIn)).toHaveLength(1);
      });

      // Signin prop: show
      it('Passes show prop to component to show sign in if no user set', () => {
            expect(wrapper.find(SignIn).props().show).toEqual(false);
            wrapper.setProps({ user: {} });
            expect(wrapper.find(SignIn).props().show).toEqual(true);
      });

      // Signin prop: login
      it('Passes login cb to sign in component', () => {
            wrapper
                  .find(SignIn)
                  .props()
                  .login('0xUserAddress');
            expect(props.login.mock.calls).toHaveLength(1);
            expect(props.login.mock.calls[0][0]).toEqual('0xUserAddress');
      });

      // NavItem with prop: logout
      it('Displays a NavItem to log out the user', () => {
            const button = wrapper
                  .find(NavItem)
                  .filterWhere(e => e.childAt(0).text() === 'Logout');
            expect(button).toHaveLength(1);
            button.props().onClick();
            expect(props.logout.mock.calls).toHaveLength(1);
      });

      // NavItem hidden
      it('Does not display the logout button if user not logged in', () => {
            wrapper.setProps({ user: {} });
            const button = wrapper
                  .find(NavItem)
                  .filterWhere(e => e.childAt(0).text() === 'Logout');
            expect(button).toHaveLength(0);
      });
});
