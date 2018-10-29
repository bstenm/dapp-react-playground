import React from 'react';
import { Formik } from 'formik';
import { shallow } from 'enzyme';
import * as ms from '../../config/messages';
import validationSchema from './validationSchema';
import CandidateInfoForm from './CandidateInfoForm';
import { CandidateInfoFormContainer } from './CandidateInfoFormContainer';
import { attachment } from '../../config';

jest.mock('../../config');

describe('(Container) CandidateInfoForm', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = {
                  match: { params: { candidate: 'Candidate' } },
                  error: jest.fn(),
                  addInfo: jest.fn()
            };
            wrapper = shallow(<CandidateInfoFormContainer {...props} />);
      });

      it('Displays a Formik component', () => {
            expect(wrapper.find(Formik)).toHaveLength(1);
      });

      // Formik prop: initialValues
      it('Passes the initial values to Formik', () => {
            const { initalValues } = wrapper.instance();
            expect(wrapper.find(Formik).props().initalValues).toEqual(
                  initalValues
            );
      });

      // Formik prop: render
      it('Passes a cb to render the CandidateInfoForm component as prop  to Formik', () => {
            const Component = wrapper
                  .find(Formik)
                  .props()
                  .render({});
            const withParent = <div>{Component}</div>;
            expect(shallow(withParent).find(CandidateInfoForm)).toHaveLength(1);
      });

      // Formik prop: validationSchema
      it('Passes the validation schema  to Formik', () => {
            expect(wrapper.find(Formik).props().validationSchema).toEqual(
                  validationSchema
            );
      });

      // Formik prop: onSubmit
      it('Passes a cb prop to submit the info to Formik', () => {
            const args = {
                  description: 'description',
                  title: 'title',
                  file: 'file'
            };
            wrapper
                  .find(Formik)
                  .props()
                  .onSubmit(args);
            expect(props.addInfo.mock.calls).toHaveLength(1);
            expect(props.addInfo.mock.calls[0][0]).toEqual({
                  ...args,
                  candidate: 'Candidate'
            });
      });

      // CandidateInfoForm prop: file
      it('Passes the uploaded file  as prop to CandidateInfoForm component', async () => {
            wrapper.setState({ file: 'some file' });
            const Form = wrapper
                  .instance()
                  .renderForm({ prop1: 'prop1', setFieldValue: 'some method' });
            expect(Form.props.file).toEqual('some file');
      });

      // CandidateInfoForm prop: ...props
      it('Passes the rest of the props to CandidateInfoForm component', async () => {
            const Form = wrapper
                  .instance()
                  .renderForm({ prop1: 'prop1', setFieldValue: 'some method' });
            expect(Form.props.prop1).toEqual('prop1');
      });

      // CandidateInfoForm prop: onDropAccepted
      it('Passes a cb to handle the accepted files to CandidateInfoForm component', () => {
            const setFieldValue = jest.fn();
            wrapper
                  .instance()
                  .onDropAccepted(setFieldValue, [
                        { name: 'name', preview: 'preview' }
                  ]);
            expect(setFieldValue.mock.calls).toHaveLength(1);
            expect(setFieldValue.mock.calls[0][0]).toEqual('file');
            expect(setFieldValue.mock.calls[0][1]).toEqual({
                  name: 'name',
                  preview: 'preview'
            });
            expect(wrapper.state().file).toEqual({
                  preview: 'preview',
                  name: 'name'
            });
      });

      // CandidateInfoForm prop: onDropRejected
      describe('(Method) onDropRejected', () => {
            let Form;

            beforeEach(() => {
                  Form = wrapper.instance().renderForm({
                        prop1: 'prop1',
                        setFieldValue: 'some method'
                  });
            });

            it('Gets passed as prop to the CandidateInfoForm component to handle rejected files', () => {
                  Form.props.onDropRejected([
                        { type: 'image/jpeg', size: 100000 }
                  ]);
                  expect(props.error.mock.calls).toHaveLength(1);
            });

            it('Dispatches an alert error if file type is not allowed', () => {
                  const typesAllowed = attachment.allowedTypes.join(', ');
                  Form.props.onDropRejected([
                        { type: 'unknown/type', size: 10000 }
                  ]);
                  expect(props.error.mock.calls).toHaveLength(1);
                  expect(props.error.mock.calls[0][0]).toEqual(
                        ms.fIleTypeError(typesAllowed)
                  );
            });

            it('Dispatches an error if file size is too large', () => {
                  Form.props.onDropRejected([
                        { type: 'image/jpeg', size: 1000000 }
                  ]);
                  expect(props.error.mock.calls).toHaveLength(1);
                  expect(props.error.mock.calls[0][0]).toEqual(
                        ms.fileTooLarge(300000)
                  );
            });

            it('Dispatches an standard error message if rejection cause is unknown', () => {
                  Form.props.onDropRejected([
                        { type: 'image/jpeg', size: 10000 }
                  ]);
                  expect(props.error.mock.calls).toHaveLength(1);
                  expect(props.error.mock.calls[0][0]).toEqual(
                        ms.unexpectedError
                  );
            });
      });
});
