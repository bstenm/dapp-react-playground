import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import CandidateInfoItem from './CandidateInfoItem';
import { ipfsRoot } from '../../config';

describe('(Component) CandidateInfoItem', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  item: {
                        fileHash: 'fileHash',
                        description: 'description',
                        title: 'title'
                  }
            };
            wrapper = shallow(<CandidateInfoItem {...props} />);
      });

      it('Displays a CandidateInfoItem', () => {
            expect(wrapper.find('.CandidateInfoItem')).toHaveLength(1);
      });

      it('Displays a Link component that points to the attachment', () => {
            expect(wrapper.find(Link)).toHaveLength(1);
            expect(wrapper.find(Link).props().to).toEqual(
                  `${ipfsRoot}fileHash`
            );
      });

      it('Displays the attachment', () => {
            expect(wrapper.find('img')).toHaveLength(1);
            expect(wrapper.find('img').props().src).toEqual(
                  `${ipfsRoot}fileHash`
            );
      });

      it('Displays the title and description of the item', () => {
            expect(wrapper.find('.text').text()).toContain('Title');
            expect(wrapper.find('.text').text()).toContain('description');
      });
});
