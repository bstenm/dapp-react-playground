import App from './App';
import React from "react";
import {connect} from 'react-redux';

export default connect(
      ({ loading, alert }) =>
      ({ loading, alert })
)(App);
