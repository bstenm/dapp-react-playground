import React from 'react';
import {shallow} from 'enzyme';
import Component from './CandidateInfoForm';

describe('(Component) CandidateInfoForm', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<Component {...props} />);
});

test( 'Displays a CandidateInfoForm', () => {
expect(wrapper.find('.CandidateInfoForm').length).toEqual(1);
});
});

