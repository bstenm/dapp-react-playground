import React from 'react';
import Voting from '../Voting';
import Header from '../Header';
import {Route} from 'react-router-dom';
import {shallow} from 'enzyme';
import Component from './App';
import ErrorBoundary from '../ErrorBoundary';

describe('(Component) App', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {};
            wrapper = shallow(<Component {...props}/>);
      });

      test( 'Displays a ErrorBoundary', () => {
            expect( wrapper.find(ErrorBoundary).length ).toEqual( 1 );
      });

      test('Displays a Header component', () => {
            expect(wrapper.find(Header).length).toEqual(1);
      });

      test('Displays a route that points to the Voting component for the root url', () => {
            const route = wrapper.find(Route).filterWhere( e => e.props().path === '/');
            expect(route.length).toEqual(1);
            expect(route.props().component).toEqual(Voting);
      });
});