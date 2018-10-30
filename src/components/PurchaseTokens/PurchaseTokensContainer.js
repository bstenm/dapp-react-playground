import React from 'react';
import { connect } from 'react-redux';
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
            const { loading } = this.props;
            return (
                  <Component
                        value={value}
                        loading={loading}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                  />
            );
      }
}

PurchaseTokensContainer.defaultProps = {
      loading: false
};

PurchaseTokensContainer.propTypes = {
      loading: PropTypes.bool,
      onSubmit: PropTypes.func.isRequired
};

export default connect(({ loading }) => ({ loading }))(PurchaseTokensContainer);
