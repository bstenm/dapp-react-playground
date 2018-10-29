import React from 'react';
import { shallow } from 'enzyme';
import Component from './CandidateInfoForm';
import CandidateInfoFormFields from '../CandidateInfoFormFields';
import CandidateInfoAttachment from '../CandidateInfoAttachment';

describe('(Component) CandidateInfoForm', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = { isSubmitting: true, onDropAccepted: jest.fn() };
            wrapper = shallow(<Component {...props} />);
      });

      it('Displays a CandidateInfoForm', () => {
            expect(wrapper.find('.CandidateInfoForm')).toHaveLength(1);
      });

      it('Displays a CandidateInfoAttachment', () => {
            expect(wrapper.find(CandidateInfoAttachment)).toHaveLength(1);
      });

      it('Displays a CandidateInfoFormFields', () => {
            expect(wrapper.find(CandidateInfoFormFields)).toHaveLength(1);
      });

      // CandidateInfoFormFields prop: isSubmitting
      it('Passes isSubmitting to CandidateInfoFormFields component', () => {
            expect(
                  wrapper.find(CandidateInfoFormFields).props().isSubmitting
            ).toEqual(true);
      });
});
