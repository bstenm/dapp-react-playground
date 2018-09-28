import React from 'react';
import Container from './PurchaseTokensContainer';
import { shallow } from 'enzyme';
import Component from './PurchaseTokens';
import {PurchaseTokensContainer} from './PurchaseTokensContainer';

describe( '(Container) PurchaseTokens', () => {
let wrapper, props;

beforeEach(() => {
      props = {
            onSubmit: jest.fn()
      };
            wrapper = shallow( <PurchaseTokensContainer { ...props } />);
      });

      test( 'Displays a PurchaseTokens component', () => {
            expect( wrapper.find( Component ).length ).toEqual( 1 );
      });

      // prop: value
      test('Passes input value to component', () => {
            wrapper.setState({value: '32'})
            expect(wrapper.find(Component).props().value).toEqual('32');
      });

      // prop: onChange
      test( 'Passes onChange cb to component to change the input value', () => {
            wrapper.find(Component).props().onChange({target: {value: '15'}});
            expect(wrapper.state().value).toEqual('15');
      });

      // prop: onSubmit
      test( 'Passes onSubmit cb to component to submit input value', () => {
            wrapper.setState({value: '32'})
            wrapper.find(Component).props().onSubmit();
            expect(props.onSubmit.mock.calls.length).toEqual(1);
            expect(props.onSubmit.mock.calls[0][0]).toEqual('32');
      });
});

