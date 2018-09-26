import React from 'react';
import {connect} from 'react-redux';
import Component from './Alert';

export class AlertContainer extends React.Component {

      onClose = () => {
            this.props.silence();
      }

      render() {
            return (
                  <Component
                        alert={this.props.alert}
                        handleClose={this.onClose}
                  />
            );
      }
};

export default connect(
      ({alert}) => ({alert}),
      ({alert: {silence}}) => ({silence})
)(AlertContainer);

