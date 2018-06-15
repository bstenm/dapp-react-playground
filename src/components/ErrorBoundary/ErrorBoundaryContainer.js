import React from 'react';
import Log from '../../services/Log';
import ErrorBoundary from './ErrorBoundary';

class Container extends React.Component {
      constructor(props) {
            super(props);
            this.state = { error: null, errorInfo: null };
      }

      componentDidCatch (error, errorInfo) {
            this.setState({ error, errorInfo });
            Log.error( error );
      }

      render() {
            return this.state.error ?
                  <ErrorBoundary /> :
                  this.props.children;
      }
};

export default Container;
