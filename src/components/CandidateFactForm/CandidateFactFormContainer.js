import cf from '../../config';
import ms from '../../config/messages';
import React from 'react';
import {Formik} from 'formik';
import {dispatch} from '../../store';
import Component from './CandidateFactForm';
import {switchCase} from '../../libs/switchCase';
import validationSchema from './validationSchema';

const { maxSize, allowedTypes } = cf.attachment;

export class CandidateFactFormContainer extends React.Component {

      state = { file: null }

      initialValues = { description: '' }

      onDropRejected = ([file]) => {
            let sizeError = {}, typeError = {};
            const { type, size } = file;
            // if size too large
            sizeError.case = maxSize < size;
            sizeError.then = () => ms.fileTooLarge(maxSize);
            // if file type not allowed
            typeError.case = ! allowedTypes.includes( type );
            typeError.then = () => ms.fIleTypeError(allowedTypes.join(', '));
            const message = switchCase([ sizeError, typeError ]);
            dispatch.alert.error(message || ms.unexpectedError );
      }

      onDropAccepted =(setFieldValue, [file]) => {
            setFieldValue('file', file);
            const { preview, name } = file;
            this.setState({ file: { preview, name }});
      }

      onSubmit = ({ description, file }) => {
            const { candidate } = this.props.match.params;
            dispatch.candidates.addInfo({ candidate, description, file });
      }

      renderForm = ({ ...props, setFieldValue }) => (
            <Component
                  {...props}
                  file={this.state.file}
                  onDropRejected={this.onDropRejected}
                  onDropAccepted={this.onDropAccepted.bind(this, setFieldValue)}
            />
      )

      render() {
            return (
                  <Formik
                        render={this.renderForm}
                        onSubmit={this.onSubmit}
                        initialValues={this.initialValues}
                        validationSchema={validationSchema}
                  />
            );
      }
};

export default CandidateFactFormContainer;

