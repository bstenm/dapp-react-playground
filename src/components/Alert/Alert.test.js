import React from 'react';
import {shallow} from 'enzyme';
import Component from './Alert';
import { Modal } from 'react-bootstrap';

describe('(Component) Alert', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  alert: 'some message',
                  handleClose: jest.fn()
            };
            wrapper = shallow(<Component {...props} />);
      });

      test( 'Displays a Alert', () => {
            expect(wrapper.find('.Alert').length).toEqual(1);
      });

      test('Displays a Modal component', () => {
            expect(wrapper.find(Modal).length).toEqual(1);
      });

      test('Shows the alert if a message is passed', () => {
            expect(wrapper.find(Modal).props().show).toEqual(true);;
            wrapper.setProps({alert: ''});
            expect(wrapper.find(Modal).props().show).toEqual(false);;
      });

      // prop: alert
      test('Displays the message passed as props', () => {
            expect(wrapper.find(Modal.Body).childAt(0).text()).toEqual('some message');
      });

      // prop: handleClose
      test( 'Passes handleClose cb to Modal', () => {
            wrapper.find(Modal).props().onHide();
            expect(props.handleClose.mock.calls.length).toEqual(1);
            expect(props.handleClose.mock.calls[0][0]).toEqual();
      });
});

