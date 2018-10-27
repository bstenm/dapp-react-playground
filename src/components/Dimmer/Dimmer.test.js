import React from 'react';
import { shallow } from 'enzyme';
import Dimmer from './Dimmer';

describe('(Component) Dimmer', () => {
      it('Displays a Dimmer', () => {
            expect(shallow(<Dimmer />).find('.Dimmer')).toHaveLength(1);
      });
});
