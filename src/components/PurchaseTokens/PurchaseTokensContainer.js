import React from 'react';
import Component from './PurchaseTokens';

export class PurchaseTokensContainer extends React.Component {

      state = {value: ''}

      onSubmit = () => {
            const {value} = this.state;
            this.props.onSubmit(value);
      }

      onChange = (e) => {
            this.setState({value: e.target.value});
      }

      render() {
            const {value} = this.state;
            return (
                  <Component
                        value={value}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                   />
            );
      }
};

export default PurchaseTokensContainer;

