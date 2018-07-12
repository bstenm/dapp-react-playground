import React from 'react';
import Component from './PurchaseTokens';

export class PurchaseTokensContainer extends React.Component {

      state = {value: ''}

      onSubmit = () => {
            this.props.onSubmit(this.state.value);
            // this.setState({value: ''});
      }

      onChange = (e) => {
            this.setState({value: e.target.value});
      }

      render() {
            return (
                  <Component
                        value={this.state.value}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                   />
            );
      }
};

export default PurchaseTokensContainer;

