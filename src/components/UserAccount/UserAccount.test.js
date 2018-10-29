import React from 'react';
import { shallow } from 'enzyme';
import Component from './UserAccount';

describe('(Component) UserAccount', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  account: {
                        tokens: 10,
                        address: '0xUserAddress',
                        votingRecord: {
                              'Asif Ali Zardari': -10,
                              'Petro Poroshenko': 100,
                              'Khalifa Bin Zayed': 0
                        }
                  }
            };
            wrapper = shallow(<Component {...props} />);
      });

      test('Displays a UserAccount', () => {
            expect(wrapper.find('.UserAccount')).toHaveLength(1);
      });

      test("Displays the user' s 0xUserAddress", () => {
            expect(
                  wrapper
                        .find('div')
                        .at(0)
                        .text()
            ).toContain('0xUserAddress');
      });

      test("Displays the user' quantity of tokens left", () => {
            expect(
                  wrapper
                        .find('div')
                        .at(0)
                        .text()
            ).toContain(10);
      });

      test("Displays the user' voting record", () => {
            const table = wrapper.find('table');
            expect(table).toHaveLength(1);
            expect(table.find('tr')).toHaveLength(3);
            expect(
                  wrapper
                        .find('tr')
                        .at(1)
                        .find('td')
                        .at(0)
                        .text()
            ).toContain('Petro Poroshenko');
            expect(
                  wrapper
                        .find('tr')
                        .at(1)
                        .find('td')
                        .at(1)
                        .text()
            ).toEqual('100');
      });

      test('Does not attempt to display any voting record html if none passed', () => {
            wrapper.setProps({
                  account: { votingRecord: null, address: '0xUserAccount' }
            });
            expect(wrapper.find('table')).toHaveLength(0);
      });
});
