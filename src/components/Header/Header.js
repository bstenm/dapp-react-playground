import './Header.css';
import React from 'react';
import {Link} from 'react-router-dom';
import SignIn from '../SignIn';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';
import UserAccount from '../UserAccount';
import PurchaseTokens from '../PurchaseTokens';
import {Nav, Navbar, NavItem, OverlayTrigger, Popover} from 'react-bootstrap';

const accountPopover = account => (
      <Popover id="popover-positioned-bottom">
            <UserAccount account={account} />
      </Popover>
);

const purchaseTokensPopover = onSubmit => (
      <Popover id="popover-trigger-click-root-close">
            <PurchaseTokens onSubmit={onSubmit} />
      </Popover>
);

export const Component = ({buyTokens, login, logout, user}) => (
      <Navbar inverse collapseOnSelect className="Header">
            <Navbar.Header>
                  <Navbar.Brand >
                        <Link to="/">
                              <Glyphicon glyph="link" title="Dapp Playground"/>
                        </Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                  <Nav pullRight>
                        <OverlayTrigger
                              rootClose
                              trigger="click"
                              placement="bottom"
                              overlay={purchaseTokensPopover(buyTokens)}>
                              <NavItem href="#">
                                    Purchase Corr Tokens
                              </NavItem>
                        </OverlayTrigger>
                        <OverlayTrigger
                              rootClose
                              trigger="click"
                              placement="bottom"
                              overlay={accountPopover(user)}>
                              <NavItem href="#">
                                    Account
                              </NavItem>
                        </OverlayTrigger>
                        {user.address &&
                        <NavItem onClick={logout} href="#">
                              Logout
                         </NavItem>
                        }
                        <SignIn login={login} show={! user.address}/>
                  </Nav>
            </Navbar.Collapse>
      </Navbar>
);

Component.propTypes = {
      login: PropTypes.func.isRequired,
      buyTokens: PropTypes.func.isRequired,
      user: PropTypes.shape({
            tokens: PropTypes.number,
            votingRecord: PropTypes.object,
            address: PropTypes.string
      }).isRequired
};

export default Component;

