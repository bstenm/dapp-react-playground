import App from './App';
import React from 'react';
import web3 from '../../services/Web3';
import {token} from '../../config';
import {Router} from 'react-router-dom';
import {connect} from 'react-redux';
import customHistory from '../../history';
import {TokenSale, Token} from '../../services/ContractsInstances';

export class AppContainer extends React.Component {

      async componentWillMount () {
            //[TEMPORARY]: Provisioning the token sale contract here for now
            const from = web3.eth.accounts[0];
            const ctToken = await Token.deployed();
            const {address} = await TokenSale.deployed();
            await ctToken.transfer(address, token.available, {from});
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
