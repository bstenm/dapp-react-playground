import React from 'react';
import Component from './PurchaseTokens';

export class PurchaseTokensContainer extends React.Component {

      state = {value: ''}

      render() {
            const {value} = this.state;
            return (
                  <Component
                        value={value}
                        onSubmit={() => this.props.onSubmit(value)}
                        onChange={e => this.setState({value: e.target.value})}
                   />
            );
      }
};

export default PurchaseTokensContainer;

