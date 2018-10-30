import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Alert from '../Alert';
import Voting from '../Voting';
import Header from '../Header';
import ErrorBoundary from '../ErrorBoundary';
import CandidateInfoList from '../CandidateInfoList';
import CandidateInfoForm from '../CandidateInfoForm';

const App = () => (
      <div className="App">
            <Header />
            <ErrorBoundary>
                  <div className="container">
                        <Alert />
                        <Switch>
                              <Route
                                    path="/info/list/:candidate"
                                    component={CandidateInfoList}
                              />
                              <Route
                                    path="/info/form/:candidate"
                                    component={CandidateInfoForm}
                              />
                              <Route path="/" component={Voting} />
                        </Switch>
                  </div>
            </ErrorBoundary>
      </div>
);

export default App;
