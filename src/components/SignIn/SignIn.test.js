import React from 'react';
import {Modal} from 'react-bootstrap';
import {shallow} from 'enzyme';
import Component from './SignIn';
import { Form, FormControl, Button  } from 'react-bootstrap';

describe('(Component) SignIn', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  show: true,
                  onLogin: jest.fn(),
                  onChange: jest.fn()
            };
            wrapper = shallow(<Component {...props} />);
      });

      test( 'Displays a SignIn component', () => {
            expect(wrapper.find('.SignIn').length).toEqual(1);
      });

      test('Displays a Modal component', () => {
            expect(wrapper.find(Modal).props().show).toEqual(true);
      });

      test('Does not displays a Modal if user already exist', () => {
            wrapper.setProps({show: false});
            expect(wrapper.find(Modal).props().show).toEqual(false);
      });

      test('Displays a Form, FormControl and a Button components', () => {
            expect(wrapper.find(Form).length).toEqual(1);
            expect(wrapper.find(FormControl).length).toEqual(1);
            expect(wrapper.find(Button).length).toEqual(1);
      });

      test('Calls submit prop on button click', () => {
            wrapper.find(Button).props().onClick();
            expect(props.onLogin.mock.calls.length).toEqual(1);
            expect(props.onLogin.mock.calls[0][0] ).toEqual();
      });
});

