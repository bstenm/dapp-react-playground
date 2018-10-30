import React from 'react';
import { shallow } from 'enzyme';
import { Form, FormControl, Button } from 'react-bootstrap';
import Loader from '../Loader';
import Component from './PurchaseTokens';

describe('(Component) PurchaseTokens', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  value: '5',
                  loading: false,
                  onSubmit: jest.fn(),
                  onChange: jest.fn()
            };
            wrapper = shallow(<Component {...props} />);
      });

      it('Displays a PurchaseTokens', () => {
            expect(wrapper.find('.PurchaseTokens')).toHaveLength(1);
      });

      it('Displays a Form component', () => {
            expect(wrapper.find(Form)).toHaveLength(1);
      });

      // FormControl
      it('Displays a FormControl component', () => {
            expect(wrapper.find(FormControl)).toHaveLength(1);
      });

      // FormControl prop: value
      it('Passes value to FormControl component', () => {
            expect(wrapper.find(FormControl).props().value).toEqual('5');
      });

      // FormControl prop: onChange
      it('Passes onChange cb to FormControl component', () => {
            wrapper
                  .find(FormControl)
                  .props()
                  .onChange('value');
            expect(props.onChange.mock.calls).toHaveLength(1);
            expect(props.onChange.mock.calls[0][0]).toEqual('value');
      });

      // Button
      it('Displays a Button component', () => {
            expect(wrapper.find(Button)).toHaveLength(1);
      });

      // Button prop: onSubmit
      it('Passes onSubmit cb to Button component', () => {
            wrapper
                  .find(Button)
                  .props()
                  .onClick();
            expect(props.onSubmit.mock.calls).toHaveLength(1);
      });

      it('Displays text if loading is set to false', () => {
            const loader = wrapper.find(Button).find(Loader);
            const text = wrapper
                  .find(Button)
                  .childAt(0)
                  .text();
            expect(text).toEqual('Buy');
            expect(loader).toHaveLength(0);
      });

      it('Displays loader if loading is set to true', () => {
            wrapper.setProps({ loading: true });
            const loader = wrapper.find(Button).find(Loader);
            expect(loader).toHaveLength(1);
      });
});
