import './index.css';
import App from './components/App';
import store from './store';
import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';

ReactDOM.render(
      <Provider store={store}>
            <App />
      </Provider>
, document.getElementById('root'));
