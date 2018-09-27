import React from 'react';
import {shallow} from 'enzyme';
import {capitalize} from 'lodash';
import CustomInputComponent from './CustomInputComponent';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

describe('(Component) CustomInputComponent', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  type: 'textarea',
                  field: { value: 'value', name: 'name' },
                  form: {
                        errors: { name: true },
                        touched: { name: true },
                        handleChange: jest.fn()
                  }
            };
            wrapper = shallow(<CustomInputComponent {...props} />);
      });

      it( 'Displays a FormGroup with the field name as control id', () => {
            expect(wrapper.find(FormGroup).length).toEqual(1);
            expect(wrapper.find(FormGroup).props().controlId).toEqual('name');
      });

      it('Displays a ControlLabel component to display the field name as label', () => {
            expect(wrapper.find(ControlLabel).length).toEqual(1);
            expect(wrapper.find(ControlLabel).childAt(0).text()).toEqual('Name');
      });

      it('Displays a FormControl component', () => {
            expect(wrapper.find(FormControl).length).toEqual(1);
      });

      // prop: value
      it('Passes value to FormControl component', () => {
            expect(wrapper.find(FormControl).props().value).toEqual('value');
      });

      // props: onChange
      it('Passes a cb prop to handle user input to FormControl component', () => {
            wrapper.find(FormControl).props().onChange();
            expect(props.form.handleChange.mock.calls.length).toEqual(1);
      });

      // prop: componentClass
      it('Passes componentClass to FormControl component', () => {
            expect(wrapper.find(FormControl).props().componentClass).toEqual('textarea');
      });

      it('Displays a input error message component only if input has been touched and an error exists for this field', () => {
            expect(wrapper.find('.input-error').length).toEqual(1);
            wrapper.setProps({ form: { touched: { name: false }, errors: { name: true }}});
            expect(wrapper.find('.input-error').length).toEqual(0);
            wrapper.setProps({ form: { touched: { name: true }, errors: { name: false }}});
            expect(wrapper.find('.input-error').length).toEqual(0);
            wrapper.setProps({ form: { touched: { name: false }, errors: { name: false }}});
            expect(wrapper.find('.input-error').length).toEqual(0);
      });
});

