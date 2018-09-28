import React from 'react';
import Dimmer from './Dimmer';
import { shallow } from 'enzyme';

describe( '(Component) Dimmer', () => {

      it( 'Displays a Dimmer', () => {
            expect( shallow( <Dimmer />).find( '.Dimmer' ).length ).toEqual( 1 );
      });
});

