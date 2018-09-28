import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';

export default connect(
      ({user}) => ({user}),
      ({user: {buyTokens, login, logout}}) => ({buyTokens, login, logout})
)(Header);

