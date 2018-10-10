import React from 'react';
import {shallow} from 'enzyme';
import CandidateInfoList from './CandidateInfoList';
import {CandidateInfoListContainer} from './CandidateInfoListContainer';

describe( '(Container) CandidateInfoList', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  match: {params: { candidate: 'Trump' }},
                  fetchInfo: jest.fn(),
                  getInfoFor: jest.fn().mockImplementation(() => ['info'])
            };
            wrapper = shallow(<CandidateInfoListContainer {...props} />);
      });

      it('Gets the candidate\'s info on mount', () => {
            expect(props.fetchInfo.mock.calls.length).toEqual(1);
            expect(props.fetchInfo.mock.calls[0][0] ).toEqual('Trump');;
      });

      it( 'Displays a CandidateInfoList component', () => {
            expect(wrapper.find(CandidateInfoList).length).toEqual(1);
      });

      //  prop: candidate
      it('Passes candidate data as prop to  component', () => {
            expect(wrapper.find(CandidateInfoList).props().candidate).toEqual('Trump');
      });

      //  prop: list
      it('Passes the list of the candidate info returned by the selector as prop to  component', () => {
            expect(props.getInfoFor.mock.calls.length).toEqual(1);
            expect(props.getInfoFor.mock.calls[0][0] ).toEqual('Trump');;
            expect(wrapper.find(CandidateInfoList).props().list).toEqual(['info']);
      });
});

