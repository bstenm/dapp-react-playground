import React from 'react';
import { shallow } from 'enzyme';
import { Form, FormControl, Button, Modal } from 'react-bootstrap';
import Component from './SignIn';

describe('(Component) SignIn', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  show: true,
                  onLogin: jest.fn(),
                  onChange: jest.fn()
            };
            wrapper = shallow(<Component {...props} />);
      });

      test('Displays a SignIn component', () => {
            expect(wrapper.find('.SignIn')).toHaveLength(1);
      });

      test('Displays a Modal component', () => {
            expect(wrapper.find(Modal).props().show).toEqual(true);
      });

      test('Does not displays a Modal if user already exist', () => {
            wrapper.setProps({ show: false });
            expect(wrapper.find(Modal).props().show).toEqual(false);
      });

      test('Displays a Form, FormControl and a Button components', () => {
            expect(wrapper.find(Form)).toHaveLength(1);
            expect(wrapper.find(FormControl)).toHaveLength(1);
            expect(wrapper.find(Button)).toHaveLength(1);
      });

      test('Calls submit prop on button click', () => {
            wrapper
                  .find(Button)
                  .props()
                  .onClick();
            expect(props.onLogin.mock.calls).toHaveLength(1);
            expect(props.onLogin.mock.calls[0][0]).toEqual();
      });
});
