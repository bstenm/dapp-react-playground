import React from 'react';
import { Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import App from './App';
import customHistory from '../../history';
import { AppContainer } from './AppContainer';
import { transferTo } from '../../services/TokenContract';
import { getContractAddress } from '../../services/TokenSaleContract';

jest.mock('../../services/Web3');
jest.mock('../../services/TokenContract');
jest.mock('../../services/TokenSaleContract');

describe('(Container) App', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = { loading: true };
            getContractAddress.mockImplementation(() => '0xRecipientAddress');
            wrapper = shallow(<AppContainer {...props} />);
      });

      it('Provisions the Token Sale contract', () => {
            expect(transferTo.mock.calls).toHaveLength(1);
            expect(transferTo.mock.calls[0][0]).toEqual('0xRecipientAddress');
      });

      it('Displays a Router component', () => {
            expect(wrapper.find(Router)).toHaveLength(1);
      });

      // Router prop: history
      it('Passes history to Router component', () => {
            expect(wrapper.find(Router).props().history).toEqual(customHistory);
      });

      it('Displays a App component', () => {
            expect(wrapper.find(Router).find(App)).toHaveLength(1);
      });

      // App prop: loading
      it('Passes loading to App component', () => {
            expect(wrapper.find(App).props().loading).toEqual(true);
      });
});
