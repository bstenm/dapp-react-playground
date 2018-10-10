import App from './App';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

// withRouter so that component re-renders on route change
export default withRouter(connect(({ loading }) => ({ loading }))(App));