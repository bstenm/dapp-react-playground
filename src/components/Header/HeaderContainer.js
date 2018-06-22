import React from 'react';
import { connect } from 'react-redux';
import Component from './Header';

export class HeaderContainer extends React.Component {

      render() {
            const {buyTokens, user, login} = this.props;
            return (
                  <Component
                        login={login}
                        buyTokens={buyTokens}
                        userAccount={user}
                  />
            );
      }
};

export default connect(
      ({user}) => ({user}),
      ({user: {buyTokens, login}}) => ({buyTokens, login})
)(HeaderContainer);

