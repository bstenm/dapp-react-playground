import React from 'react';
import { shallow } from 'enzyme';
import CandidateInfoList from './CandidateInfoList';
import { CandidateInfoListContainer } from './CandidateInfoListContainer';

describe('(Container) CandidateInfoList', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  match: { params: { candidate: 'Khalifa Bin Zayed' } },
                  fetchInfo: jest.fn(),
                  getInfoFor: jest.fn().mockImplementation(() => ['info'])
            };
            wrapper = shallow(<CandidateInfoListContainer {...props} />);
      });

      it("Gets the candidate's info on mount", () => {
            expect(props.fetchInfo.mock.calls).toHaveLength(1);
            expect(props.fetchInfo.mock.calls[0][0]).toEqual(
                  'Khalifa Bin Zayed'
            );
      });

      it('Displays a CandidateInfoList component', () => {
            expect(wrapper.find(CandidateInfoList)).toHaveLength(1);
      });

      //  prop: candidate
      it('Passes candidate data as prop to  component', () => {
            expect(wrapper.find(CandidateInfoList).props().candidate).toEqual(
                  'Khalifa Bin Zayed'
            );
      });

      //  prop: list
      it('Passes the list of the candidate info returned by the selector as prop to  component', () => {
            expect(props.getInfoFor.mock.calls).toHaveLength(1);
            expect(props.getInfoFor.mock.calls[0][0]).toEqual(
                  'Khalifa Bin Zayed'
            );
            expect(wrapper.find(CandidateInfoList).props().list).toEqual([
                  'info'
            ]);
      });
});
