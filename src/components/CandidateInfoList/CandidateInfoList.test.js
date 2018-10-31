import React from 'react';
import { shallow } from 'enzyme';
import CandidateInfoList from './CandidateInfoList';
import CandidateInfoItem from '../CandidateInfoItem';
import Loader from '../Loader';

describe('(Component) CandidateInfoList', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  list: [
                        {
                              fileHash: 'fileHash1',
                              description: 'description1',
                              title: 'title1'
                        },
                        {
                              fileHash: 'fileHash2',
                              description: 'description2',
                              title: 'title2'
                        }
                  ],
                  loading: false,
                  candidate: 'Candidate'
            };
            wrapper = shallow(<CandidateInfoList {...props} />);
      });

      it('Displays a CandidateInfoList', () => {
            expect(wrapper.find('.CandidateInfoList')).toHaveLength(1);
      });

      it('Displays a CandidateInfoItem component for each item in the list', () => {
            expect(wrapper.find(CandidateInfoItem)).toHaveLength(2);
            expect(
                  wrapper
                        .find(CandidateInfoItem)
                        .at(1)
                        .props().item
            ).toEqual({
                  fileHash: 'fileHash2',
                  description: 'description2',
                  title: 'title2'
            });
      });

      it('Does not attempt to display the list if no list passed', () => {
            wrapper.setProps({ list: [] });
            expect(wrapper.find('ul')).toHaveLength(0);
      });

      it('Shows Loader while list is being fetched', () => {
            wrapper.setProps({ loading: true, list: [] });
            expect(wrapper.find(Loader)).toHaveLength(1);
      });
});
