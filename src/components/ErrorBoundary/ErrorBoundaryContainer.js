import React from 'react';
import Log from '../../services/Log';
import ErrorBoundary from './ErrorBoundary';

export class ErrorBoundaryContainer extends React.Component {
      state = { error: null, errorInfo: null };

      componentDidCatch(error, errorInfo) {
            this.setState({ error, errorInfo });
            Log.error(errorInfo);
      }

      render() {
            return this.state.error ? <ErrorBoundary /> : this.props.children;
      }
}

ErrorBoundary.propsType = {};

export default ErrorBoundaryContainer;
