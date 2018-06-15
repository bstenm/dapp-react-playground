import React from 'react';
import {shallow} from 'enzyme';
import Container from './[ComponentName]Container';
import Component from './[ComponentName]';
import {[ComponentName]Container} from '../[ComponentName]Container';

describe( '(Container) [ComponentName]', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {};
            wrapper = shallow(<[ComponentName]Container {...props} />);
      });

      test( 'Displays a [ComponentName] component', () => {
            expect(wrapper.find(Component).length).toEqual(1);
      });
});

