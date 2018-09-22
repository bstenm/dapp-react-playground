import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './store';
import App from './components/App';
import {admin} from './services/Web3';
import {Provider} from 'react-redux';
import {token} from './config';
import customHistory from './history';
import Contracts from './services/ContractsInstances';
import {Router} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

//[TEMPORARY]: Provisioning the token sale contract here for now
let  ctToken;
Contracts.Token
.deployed()
.then( instance => ctToken = instance )
.then(() => Contracts.TokenSale.deployed())
.then(({address}) => {
      ctToken.transfer(address, token.available, {from: admin});
});

ReactDOM.render(
      <Provider store={ store }>
            <Router history={customHistory}>
                  <App />
            </Router>
      </Provider>
      , document.getElementById('root'));
registerServiceWorker();
