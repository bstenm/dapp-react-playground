import React from 'react';
import { shallow } from 'enzyme';
import Component from './Loader';

describe('(Component) Loader', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {};
            wrapper = shallow(<Component {...props} />);
      });

      test('Displays a Loader', () => {
            expect(wrapper.find('.Loader')).toHaveLength(1);
      });
});
