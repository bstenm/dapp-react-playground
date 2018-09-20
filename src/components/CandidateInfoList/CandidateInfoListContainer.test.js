import React from 'react';
import {shallow} from 'enzyme';
import Container from './CandidateInfoListContainer';
import Component from './CandidateInfoList';
import {CandidateInfoListContainer} from '../CandidateInfoListContainer';

describe( '(Container) CandidateInfoList', () => {
let wrapper, props;

beforeEach(() => {
props = {};
wrapper = shallow(<CandidateInfoListContainer {...props} />);
});

test( 'Displays a CandidateInfoList component', () => {
expect(wrapper.find(Component).length).toEqual(1);
});
});

