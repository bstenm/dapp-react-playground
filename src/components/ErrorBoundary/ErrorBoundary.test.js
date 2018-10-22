import React from 'react';
import {shallow} from 'enzyme';
import ErrorBoundary from './ErrorBoundary';
import {unexpectedError} from '../../config/messages';

describe('(Component) ErrorBoundary', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {};
            wrapper = shallow(<ErrorBoundary {...props}/>);
      });

      it( 'Displays a ErrorBoundary', () => {
            expect( wrapper.find( '.ErrorBoundary' ).length ).toEqual( 1 );
      });

      // error message
      it('Displays a error message component', () => {
            expect(wrapper.find('.ErrorBoundary').childAt(0).text()).toEqual(unexpectedError);
      });
});