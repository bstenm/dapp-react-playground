import React from 'react';
import PropTypes from 'prop-types';
import Log from '../../services/Log';
import ErrorBoundary from './ErrorBoundary';

export class ErrorBoundaryContainer extends React.Component {
      state = { error: null };

      componentDidCatch(error, errorInfo) {
            this.setState({ error });
            Log.error(errorInfo);
      }

      render() {
            const { error } = this.state;
            const { children } = this.props;
            return error ? <ErrorBoundary /> : children;
      }
}

ErrorBoundaryContainer.propTypes = {
      children: PropTypes.object.isRequired
};

export default ErrorBoundaryContainer;
