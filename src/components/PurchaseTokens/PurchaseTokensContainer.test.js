import React from 'react';
import { shallow } from 'enzyme';
import PurchaseTokens from './PurchaseTokens';
import { PurchaseTokensContainer } from './PurchaseTokensContainer';

describe('(Container) PurchaseTokens', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  loading: true,
                  onSubmit: jest.fn()
            };
            wrapper = shallow(<PurchaseTokensContainer {...props} />);
      });

      it('Displays a PurchaseTokens component', () => {
            expect(wrapper.find(PurchaseTokens)).toHaveLength(1);
      });

      // prop: value
      it('Passes input value to component', () => {
            wrapper.setState({ value: '32' });
            expect(wrapper.find(PurchaseTokens).props().value).toEqual('32');
      });

      // prop: onChange
      it('Passes onChange cb to component to change the input value', () => {
            wrapper
                  .find(PurchaseTokens)
                  .props()
                  .onChange({ target: { value: '15' } });
            expect(wrapper.state().value).toEqual('15');
      });

      // prop: loading
      it('Passes loading to PurchaseTokens component', () => {
            expect(wrapper.find(PurchaseTokens).props().loading).toEqual(true);
      });

      // prop: onSubmit
      it('Passes onSubmit cb to component to submit input value', () => {
            wrapper.setState({ value: '32' });
            wrapper
                  .find(PurchaseTokens)
                  .props()
                  .onSubmit();
            expect(props.onSubmit.mock.calls).toHaveLength(1);
            expect(props.onSubmit.mock.calls[0][0]).toEqual('32');
      });
});
