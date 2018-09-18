import React from 'react';
import {shallow} from 'enzyme';
import Container from './FileUploadContainer';
import Component from './FileUpload';
import {FileUploadContainer} from '../FileUploadContainer';

describe( '(Container) FileUpload', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<FileUploadContainer {...props} />);
});

test( 'Displays a FileUpload component', () => {
expect(wrapper.find(Component).length).toEqual(1);
});
});

