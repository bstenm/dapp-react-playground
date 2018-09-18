import React from 'react';
import {shallow} from 'enzyme';
import Component from './CustomInputComponent';

describe('(Component) CustomInputComponent', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<Component {...props} />);
});

test( 'Displays a CustomInputComponent', () => {
expect(wrapper.find('.CustomInputComponent').length).toEqual(1);
});
});

