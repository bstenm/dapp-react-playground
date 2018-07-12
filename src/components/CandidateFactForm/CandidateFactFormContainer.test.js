import React from 'react';
import {shallow} from 'enzyme';
import Container from './CandidateFactFormContainer';
import Component from './CandidateFactForm';
import {CandidateFactFormContainer} from '../CandidateFactFormContainer';

describe( '(Container) CandidateFactForm', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<CandidateFactFormContainer {...props} />);
});

test( 'Displays a CandidateFactForm component', () => {
expect(wrapper.find(Component).length).toEqual(1);
});
});

