import React from 'react';
import Component from './SignIn';

export class SignInContainer extends React.Component {

      state = {name: ''}

      login = () => {
            this.props.login(this.state.name);
            this.setState({name: ''});
      }

      onChange = (e) => {
            this.setState({name: e.target.value})
      }

      render() {
            return (
                  <Component
                        show={this.props.show}
                        value={this.state.name}
                        onLogin={this.login}
                        onChange={this.onChange}
                  />
            );
      }
};

export default SignInContainer;

