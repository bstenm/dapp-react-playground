import React from 'react';
import {shallow} from 'enzyme';
import Container from './CandidateInfoForm';
import Component from './CandidateInfoForm';
import {CandidateInfoForm} from '../CandidateInfoForm';

describe( '(Container) CandidateInfoForm', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<CandidateInfoForm {...props} />);
});

test( 'Displays a CandidateInfoForm component', () => {
expect(wrapper.find(Component).length).toEqual(1);
});
});

