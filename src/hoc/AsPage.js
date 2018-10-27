import React from 'react';
import { connect } from 'react-redux';

export default (WrappedComponent) => {
      class AsPage extends React.Component {
            componentWillMount() {
                  this.props.silenceAlert();
            }

            render() {
                  return <WrappedComponent {...this.props} />;
            }
      }

      return connect(
            null,
            ({ alert: { silence } }) => ({ silenceAlert: silence }),
      )(AsPage);
};
