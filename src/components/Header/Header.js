import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
      Nav,
      Navbar,
      NavItem,
      OverlayTrigger,
      Popover,
      Glyphicon
} from 'react-bootstrap';
import SignIn from '../SignIn';
import UserAccount from '../UserAccount';
import PurchaseTokens from '../PurchaseTokens';

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

const Header = ({ buyTokens, login, logout, user }) => (
      <Navbar inverse collapseOnSelect className="Header">
            <Navbar.Header>
                  <Navbar.Brand>
                        <Link to="/">
                              <Glyphicon glyph="link" title="Dapp Playground" />
                        </Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                  <Nav pullRight>
                        {user.address && (
                              <React.Fragment>
                                    <OverlayTrigger
                                          rootClose
                                          trigger="click"
                                          placement="bottom"
                                          overlay={purchaseTokensPopover(
                                                buyTokens
                                          )}
                                    >
                                          <NavItem href="#">
                                                Purchase Corr Tokens
                                          </NavItem>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                          rootClose
                                          trigger="click"
                                          placement="bottom"
                                          overlay={accountPopover(user)}
                                    >
                                          <NavItem href="#">Account</NavItem>
                                    </OverlayTrigger>
                                    <NavItem onClick={logout} href="#">
                                          Logout
                                    </NavItem>
                              </React.Fragment>
                        )}
                        <SignIn login={login} show={!user.address} />
                  </Nav>
            </Navbar.Collapse>
      </Navbar>
);

Header.propTypes = {
      login: PropTypes.func.isRequired,
      logout: PropTypes.func.isRequired,
      buyTokens: PropTypes.func.isRequired,
      user: PropTypes.shape({
            address: PropTypes.string
      }).isRequired
};

export default Header;
