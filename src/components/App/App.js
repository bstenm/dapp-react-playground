import './App.css';
import Alert from '../Alert';
import React from 'react';
import Voting from '../Voting';
import Loader from '../Loader';
import Header from '../Header';
import Dimmer from '../Dimmer';
import ErrorBoundary from '../ErrorBoundary';
import { Route, Switch } from 'react-router-dom';
import CandidateInfoList from '../CandidateInfoList';
import CandidateInfoForm from '../CandidateInfoForm';

export const App = ({ loading, alert: { message, type }}) => (
      <div className="App">
            { loading && (
                  <div>
                        <Dimmer />
                        <Loader />
                  </div>
            )}
            <Header />
            <ErrorBoundary>
                  <div className="container" >
                        { message && (
                        <Alert message={message} type={type}/>
                        )}
                        <Switch>
                              <Route path="/info/list/:candidate" component={CandidateInfoList} />
                              <Route path="/info/form/:candidate" component={CandidateInfoForm} />
                              <Route path="/" component={Voting} />
                        </Switch>
                  </div>
            </ErrorBoundary>
      </div>
)

export default App
