import React from 'react';
import { shallow } from 'enzyme';
import Component from './PurchaseTokens';

describe( '(Component) PurchaseTokens', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {};
            wrapper = shallow( <Component { ...props } />);
      });

      test( 'Displays a PurchaseTokens', () => {
            expect( wrapper.find('.PurchaseTokens').length ).toEqual( 1 );
      });
});

