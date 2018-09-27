import React from 'react';
import Voting from '../Voting';
import Loader from '../Loader';
import Header from '../Header';
import {Route} from 'react-router-dom';
import Dimmer from '../Dimmer';
import {shallow} from 'enzyme';
import Component from './App';
import ErrorBoundary from '../ErrorBoundary';
import CandidateInfoList from '../CandidateInfoList';
import CandidateInfoForm from '../CandidateInfoForm';

describe('(Component) App', () => {
      let wrapper, props;

      beforeEach(() => {
            props = { loading: false };
            wrapper = shallow(<Component {...props}/>);
      });

      it('Displays a Loader and Dimmer components if loading is on', () => {
            wrapper.setProps({ loading: true });
            expect(wrapper.find(Loader).length).toEqual(1);
            expect(wrapper.find(Dimmer).length).toEqual(1);
      });

      it('Does not display a Loader and Dimmer components if loading is off', () => {
            expect(wrapper.find(Loader).length).toEqual(0);
            expect(wrapper.find(Dimmer).length).toEqual(0);
      });

      it( 'Displays a ErrorBoundary', () => {
            expect( wrapper.find(ErrorBoundary).length ).toEqual( 1 );
      });

      it('Displays a Header component', () => {
            expect(wrapper.find(Header).length).toEqual(1);
      });

      it('Displays a route that points to the Voting component for the root url', () => {
            const route = wrapper.find(Route).filterWhere( e => e.props().path === '/');
            expect(route.length).toEqual(1);
            expect(route.props().component).toEqual(Voting);
      });

      it('Displays a route that points to the CandidateInfoList component', () => {
            const route = wrapper.find(Route).filterWhere( e => e.props().path === '/info/list/:candidate');
            expect(route.length).toEqual(1);
            expect(route.props().component).toEqual(CandidateInfoList);
      });

      it('Displays a route that points to the CandidateInfoForm component', () => {
            const route = wrapper.find(Route).filterWhere( e => e.props().path === '/info/form/:candidate');
            expect(route.length).toEqual(1);
            expect(route.props().component).toEqual(CandidateInfoForm);
      });
});