import React from 'react';
import {shallow} from 'enzyme';
import Component from './FileUpload';

describe('(Component) FileUpload', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<Component {...props} />);
});

test( 'Displays a FileUpload', () => {
expect(wrapper.find('.FileUpload').length).toEqual(1);
});
});

