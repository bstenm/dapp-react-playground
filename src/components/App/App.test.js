import React from 'react';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';
import Voting from '../Voting';
import Header from '../Header';
import Component from './App';
import ErrorBoundary from '../ErrorBoundary';
import CandidateInfoList from '../CandidateInfoList';
import CandidateInfoForm from '../CandidateInfoForm';

describe('(Component) App', () => {
      let wrapper;

      beforeEach(() => {
            wrapper = shallow(<Component />);
      });

      it('Displays a ErrorBoundary', () => {
            expect(wrapper.find(ErrorBoundary)).toHaveLength(1);
      });

      it('Displays a Header component', () => {
            expect(wrapper.find(Header)).toHaveLength(1);
      });

      it('Displays a route that points to the Voting component for the root url', () => {
            const route = wrapper
                  .find(Route)
                  .filterWhere(e => e.props().path === '/');
            expect(route).toHaveLength(1);
            expect(route.props().component).toEqual(Voting);
      });

      it('Displays a route that points to the CandidateInfoList component', () => {
            const route = wrapper
                  .find(Route)
                  .filterWhere(e => e.props().path === '/info/list/:candidate');
            expect(route).toHaveLength(1);
            expect(route.props().component).toEqual(CandidateInfoList);
      });

      it('Displays a route that points to the CandidateInfoForm component', () => {
            const route = wrapper
                  .find(Route)
                  .filterWhere(e => e.props().path === '/info/form/:candidate');
            expect(route).toHaveLength(1);
            expect(route.props().component).toEqual(CandidateInfoForm);
      });
});
