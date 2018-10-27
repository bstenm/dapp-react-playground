import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Alert from '../Alert';
import Voting from '../Voting';
import Loader from '../Loader';
import Header from '../Header';
import Dimmer from '../Dimmer';
import ErrorBoundary from '../ErrorBoundary';
import CandidateInfoList from '../CandidateInfoList';
import CandidateInfoForm from '../CandidateInfoForm';

export const App = ({ loading }) => (
  <div className="App">
        {loading && (
            <div>
          <Dimmer />
          <Loader />
                  </div>
            )}
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

App.defaultProps = {
      loading: false,
};

App.propTypes = {
      loading: PropTypes.bool,
};

export default App;
