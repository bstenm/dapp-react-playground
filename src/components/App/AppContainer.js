import App from './App';
import React from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

export class AppContainer extends React.Component {

      closeAlert = () => {
            this.props.silence();
      }

      render () {
            return <App {...this.props} closeAlert={this.closeAlert}/>
      }
}

// withRouter so that component re-renders on route change
export default withRouter(connect(
      ({ loading, alert }) => ({ loading, alert }),
      ({ alert: { silence }}) => ({ silence })
)(AppContainer));
