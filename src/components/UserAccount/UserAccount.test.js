import React from 'react';
import {shallow} from 'enzyme';
import Component from './UserAccount';

describe('(Component) UserAccount', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  account: {
                        tokens: 10,
                        address: '0xUserAddress',
                        votingRecord: {
                              Hilary: -10,
                              Jill: 100,
                              Trump: 0
                        }
                  }
            };
            wrapper = shallow(<Component {...props} />);
      });

      test( 'Displays a UserAccount', () => {
            expect(wrapper.find('.UserAccount').length).toEqual(1);
      });

      test('Displays the user\' s 0xUserAddress', () => {
            expect(wrapper.find('div').at(0).text()).toContain('0xUserAddress');
      });

      test('Displays the user\' quantity of tokens left', () => {
            expect(wrapper.find('div').at(0).text()).toContain(10);
      });

      test('Displays the user\' voting record', () => {
            const table = wrapper.find('table');
            expect(table.length).toEqual(1);
            expect(table.find('tr').length).toEqual(3);
            expect(wrapper.find('tr').at(1).find('td').at(0).text()).toContain('Jill');
            expect(wrapper.find('tr').at(1).find('td').at(1).text()).toEqual("100");
      });

      test('Does not attempt to display any voting record html if none passed', () => {
            wrapper.setProps({account: { votingRecord: null}});
            expect(wrapper.find('table').length).toEqual(0);
      });
});

