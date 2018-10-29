import React from 'react';
import PropTypes from 'prop-types';
import Component from './PurchaseTokens';

export class PurchaseTokensContainer extends React.Component {
      state = { value: '' };

      onSubmit = () => {
            const { onSubmit } = this.props;
            onSubmit(this.state.value);
            this.setState({ value: '' });
      };

      onChange = e => {
            this.setState({ value: e.target.value });
      };

      render() {
            const { value } = this.state;
            return (
                  <Component
                        value={value}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                  />
            );
      }
}

PurchaseTokensContainer.propTypes = {
      onSubmit: PropTypes.func.isRequired
};

export default PurchaseTokensContainer;
