import React from 'react';
import {shallow} from 'enzyme';
import Component from './CandidateInfoList';

describe('(Component) CandidateInfoList', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<Component {...props} />);
});

test( 'Displays a CandidateInfoList', () => {
expect(wrapper.find('.CandidateInfoList').length).toEqual(1);
});
});

