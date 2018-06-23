import React from 'react';
import { connect } from 'react-redux';
import Component from './Header';

export class HeaderContainer extends React.Component {

      render() {
            const {buyTokens, user, login, logout} = this.props;
            return (
                  <Component
                        login={login}
                        logout={logout}
                        buyTokens={buyTokens}
                        userAccount={user}
                  />
            );
      }
};

export default connect(
      ({user}) => ({user}),
      ({user: {buyTokens, login, logout}}) => ({buyTokens, login, logout})
)(HeaderContainer);

