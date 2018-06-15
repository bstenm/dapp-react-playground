import React from 'react';
import Component from './SignIn';

export class SignInContainer extends React.Component {

      state = {name: ''}

      render() {
            const {name} = this.state;
            const {show, login} = this.props;
            return (
                  <Component
                        show={show}
                        value={name}
                        onSubmit={() => login(name)}
                        onChange={e => this.setState({name: e.target.value})}
                  />
            );
      }
};

export default SignInContainer;

