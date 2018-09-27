import cf from '../../config';
import React from 'react';
import * as ms from '../../config/messages';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import {switchCase} from '../../libs/switchCase';
import validationSchema from './validationSchema';
import CandidateInfoForm from './CandidateInfoForm';

const { maxSize, allowedTypes } = cf.attachment;

export class CandidateInfoFormContainer extends React.Component {

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
            this.props.error(message || ms.unexpectedError );
      }

      onDropAccepted =(setFieldValue, [file]) => {
            setFieldValue('file', file);
            const { preview, name } = file;
            this.setState({ file: { preview, name }});
      }

      onSubmit = ({ description, title, file }) => {
            const { candidate } = this.props.match.params;
            this.props.addInfo({ candidate, title, description, file });
      }

      renderForm = ({ ...props, setFieldValue }) => (
            <CandidateInfoForm
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

export default connect(null, ({
      alert: { error },
      candidates: { addInfo }
}) => ({ addInfo, error })
)(CandidateInfoFormContainer);

