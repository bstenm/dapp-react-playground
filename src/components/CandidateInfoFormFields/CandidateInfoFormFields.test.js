import React from 'react';
import {shallow} from 'enzyme';
import {Form, Field} from 'formik';
import CustomInputComponent from '../CustomInputComponent';
import CandidateInfoFormFields from './CandidateInfoFormFields';
import {Button, Glyphicon, ControlLabel} from 'react-bootstrap';

describe('(Component) CandidateInfoFormFields', () => {
      let wrapper, props;

      beforeEach(() => {
      props = {};
      wrapper = shallow(<CandidateInfoFormFields {...props} />);
      });

      it( 'Displays a CandidateInfoFormFields', () => {
            expect(wrapper.find('.CandidateInfoFormFields').length).toEqual(1);
      });

      it('Displays a Form component', () => {
            expect(wrapper.find(Form).length).toEqual(1);
      });

      it('Displays a Field component for the info title', () => {
            expect(wrapper.find(Field).at(0).props().name).toEqual('title');
            expect(wrapper.find(Field).at(0).props().component).toEqual(CustomInputComponent);
      });

      it('Displays a Field component for the info title', () => {
            expect(wrapper.find(Field).at(1).props().name).toEqual('description');
            expect(wrapper.find(Field).at(1).props().component).toEqual(CustomInputComponent);
      });

      it('Displays a Button component', () => {
            expect(wrapper.find(Button).length).toEqual(1);
      });

      it('Disables the button is foorm is being submitted', async () => {
            expect(wrapper.find(Button).props().disabled).toEqual(false);
            wrapper.setProps({ isSubmitting: true });
            expect(wrapper.find(Button).props().disabled).toEqual(true);
      });
});

