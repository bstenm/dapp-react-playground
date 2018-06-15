import './App.css';
import Alert from '../Alert';
import React from 'react';
import Voting from '../Voting';
import Header from '../Header';
import ErrorBoundary from '../ErrorBoundary';
import { Route } from 'react-router-dom';

const App = () => (
      <ErrorBoundary>
            <Header />
            <Alert />
            <div className="container" >
                  <Route path="/" component={Voting} />
            </div>
      </ErrorBoundary>
)

export default App
