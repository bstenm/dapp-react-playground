import React from 'react';
import {mount} from 'enzyme';
import Container from './AlertContainer';
import Component from './Alert';
import {AlertContainer} from './AlertContainer';

describe( '(Container) Alert', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  alert: 'some message',
                  message: jest.fn()
            };
            wrapper = mount(<AlertContainer {...props} />);
      });

      test( 'Displays a Alert component', () => {
            expect(wrapper.find(Component).length).toEqual(1);
      });

      // prop: alert
      test('Passes alert to component', () => {
            expect(wrapper.find(Component).props().alert).toEqual('some message');
      });

      // prop: handleClose
      test( 'Passes cb to component to close the modal', () => {
            wrapper.find(Component).props().handleClose();
            expect(props.message.mock.calls.length).toEqual(1);
            expect(props.message.mock.calls[0][0] ).toEqual('');
      });
});

