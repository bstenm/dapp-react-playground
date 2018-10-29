import { connect } from 'react-redux';
import Header from './Header';

export default connect(
      ({ user }) => ({ user }),
      ({ user: { buyTokens, login, logout } }) => ({ buyTokens, login, logout })
)(Header);
