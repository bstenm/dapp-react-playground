import React from 'react';
import {shallow} from 'enzyme';
import Component from './CandidateFactForm';

describe('(Component) CandidateFactForm', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<Component {...props} />);
});

test( 'Displays a CandidateFactForm', () => {
expect(wrapper.find('.CandidateFactForm').length).toEqual(1);
});
});

