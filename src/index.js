import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './store';
import App from './components/App';
import {admin} from './services/Web3';
import {Provider} from 'react-redux';
import Contracts from './services/ContractsInstances';
import {BrowserRouter} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

//[TEMPORARY]: Provisioning the token sale contract
let  ctToken;
Contracts.Token
.deployed()
.then( instance => ctToken = instance )
.then(() => Contracts.TokenSale.deployed())
.then(({address}) => {
      ctToken.transfer(address, 750000, {from: admin});
});

ReactDOM.render(
      <Provider store={ store }>
            <BrowserRouter>
                  <App />
            </BrowserRouter>
      </Provider>
      , document.getElementById('root'));
registerServiceWorker();
