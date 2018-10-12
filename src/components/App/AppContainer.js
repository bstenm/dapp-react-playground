import App from './App';
import React from 'react';
import web3 from '../../services/Web3';
import {token} from '../../config';
import {Router} from 'react-router-dom';
import {connect} from 'react-redux';
import {transferTo} from '../../services/TokenContract';
import customHistory from '../../history';
import {getContractAddress} from '../../services/TokenSaleContract';

export class AppContainer extends React.Component {

      async componentDidMount () {
            //[TEMPORARY]: Provisioning the token sale contract here for now
            const address = await getContractAddress();
            await transferTo(address, token.available);
      }

      render () {
            return (
                  <Router history={customHistory}>
                        <App {...this.props}/>
                  </Router>
            );
      }
};

export default connect(({ loading }) => ({ loading }))(AppContainer);
