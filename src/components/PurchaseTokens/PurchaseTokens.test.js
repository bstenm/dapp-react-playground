import React from 'react';
import {shallow} from 'enzyme';
import Component from './PurchaseTokens';
import {Form, FormControl, Button} from 'react-bootstrap';

describe( '(Component) PurchaseTokens', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  value: '5',
                  onSubmit: jest.fn(),
                  onChange: jest.fn()
            };
            wrapper = shallow( <Component { ...props } />);
      });

      test( 'Displays a PurchaseTokens', () => {
            expect( wrapper.find('.PurchaseTokens').length ).toEqual(1);
      });

      test('Displays a Form component', () => {
            expect(wrapper.find(Form).length).toEqual(1);
      });

      test('Displays a FormControl component', () => {
            expect(wrapper.find(FormControl).length).toEqual(1);
      });

      // prop: value
      test('Passes value to FormControl component', () => {
            expect(wrapper.find(FormControl).props().value).toEqual('5');
      });

      // prop: onChange
      test( 'Passes onChange cb to component', () => {
            wrapper.find(FormControl).props().onChange('value');
            expect(props.onChange.mock.calls.length).toEqual(1);
            expect(props.onChange.mock.calls[0][0]).toEqual('value');
      });

      test('Displays a Button component', () => {
            expect(wrapper.find(Button).length).toEqual(1);
      });

      // prop: onSubmit
      test( 'Passes onSubmit cb to component', () => {
            wrapper.find(Button).props().onClick();
            expect(props.onSubmit.mock.calls.length).toEqual(1);
      });
});

