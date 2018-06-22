import React from 'react';
import {connect} from 'react-redux';
import Component from './Alert';

export class AlertContainer extends React.Component {

      onClose = () => {
            this.props.message('')
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
      ({alert: {message}}) => ({message})
)(AlertContainer);

