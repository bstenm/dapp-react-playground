import React from 'react';
import {shallow} from 'enzyme';
import Container from './SignInContainer';
import Component from './SignIn';
import {SignInContainer} from './SignInContainer';

describe( '(Container) SignIn', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  show: true,
                  login: jest.fn()
            };
            wrapper = shallow(<SignInContainer {...props} />);
      });

      test( 'Displays a SignIn component', () => {
            expect(wrapper.find(Component).length).toEqual(1);
      });

      // prop: show
      test('Passes show prop to component to set modal to open or close', () => {
            expect(wrapper.find(Component).props().show).toEqual(true);
      });

      // prop: value
      test('Passes input value to component', () => {
            wrapper.setState({name: 'Jennifer'});
            expect(wrapper.find(Component).props().value).toEqual('Jennifer');
      });

      // prop: onChange
      test( 'Passes onChange cb to component', () => {
            expect(wrapper.state().name).toEqual('');
            wrapper.find(Component).props().onChange({target: {value: 'Jen'}});
            expect(wrapper.state().name).toEqual('Jen');
      });

      // prop: onLogin
      test( 'Passes onLogin cb to component to login user', () => {
            wrapper.setState({name: 'Jennifer'});
            wrapper.find(Component).props().onLogin();
            expect(props.login.mock.calls.length).toEqual(1);
            expect(props.login.mock.calls[0][0]).toEqual('Jennifer');
      });
});

