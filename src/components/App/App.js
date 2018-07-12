import './App.css';
import Alert from '../Alert';
import React from 'react';
import Voting from '../Voting';
import Header from '../Header';
import CandidateFact from '../CandidateFactForm';
import ErrorBoundary from '../ErrorBoundary';
import { Route, Switch } from 'react-router-dom';

const App = () => (
      <ErrorBoundary>
            <Header />
            <Alert />
            <div className="container" >
                  <Switch>
                        <Route path="/info/:candidate" component={CandidateFact} />
                        <Route path="/" component={Voting} />
                  </Switch>
            </div>
      </ErrorBoundary>
)

export default App
