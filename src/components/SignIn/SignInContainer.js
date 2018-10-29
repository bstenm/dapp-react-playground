import React from 'react';
import PropTypes from 'prop-types';
import SignIn from './SignIn';

export class SignInContainer extends React.Component {
      state = { name: '' };

      login = () => {
            const { login } = this.props;
            login(this.state.name);
            this.setState({ name: '' });
      };

      onChange = e => {
            this.setState({ name: e.target.value });
      };

      render() {
            const { show } = this.props;
            const { name } = this.state;
            return (
                  <SignIn
                        show={show}
                        value={name}
                        onLogin={this.login}
                        onChange={this.onChange}
                  />
            );
      }
}

SignInContainer.propTypes = {
      login: PropTypes.func.isRequired,
      show: PropTypes.bool.isRequired
};

export default SignInContainer;
