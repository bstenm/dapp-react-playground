import React from 'react';
import {connect} from 'react-redux';
import Component from './Alert';

export class AlertContainer extends React.Component {

      render() {
            const {alert, message} = this.props;
            return (
                  <Component
                        alert={alert}
                        handleClose={() => message('')}
                  />
            );
      }
};

export default connect(
      ({alert}) => ({alert}),
      ({alert: {message}}) => ({message})
)(AlertContainer);

