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
            const {name} = this.state;
            const {show} = this.props;
            return (
                  <Component
                        show={show}
                        value={name}
                        onLogin={this.login}
                        onChange={this.onChange}
                  />
            );
      }
};

export default SignInContainer;

