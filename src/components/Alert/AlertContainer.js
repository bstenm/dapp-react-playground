import React from 'react';
import {connect} from 'react-redux';
import Component from './Alert';

export default connect(
      ({alert}) => ({alert}),
      ({alert: {silence}}) => ({silence})
)(Component);

