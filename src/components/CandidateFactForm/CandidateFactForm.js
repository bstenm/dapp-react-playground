// [TODO]: Deal with preview memory leaks
import './CandidateFactForm.css';
import cf from '../../config';
import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import {Form, Field} from 'formik';
import CustomInputComponent from '../CustomInputComponent';
import {Button, Glyphicon, ControlLabel} from 'react-bootstrap';

const { allowedTypes, maxSize, previewDim } = cf.attachment;

export const Component = ({
      file,
      errors,
      values,
      touched,
      isSubmitting,
      onDrop,
      onDropRejected,
      onDropAccepted,
}) => (
      <div className="CandidateFactForm" >
            <div className="attachment">
                  <ControlLabel>Attachment</ControlLabel>
                  <Dropzone
                        accept={ allowedTypes.join( ',' ) }
                        onDrop={onDrop}
                        maxSize={ maxSize }
                        className="dropzone"
                        onDropRejected={onDropRejected}
                        rejectClassName="unauthorized"
                        acceptClassName="authorized"
                        onDropAccepted={onDropAccepted}>
                        <Glyphicon glyph="paperclip" title="Click or Drop"/>
                  </Dropzone>
                  { file &&
                  <div>
                        <img
                              alt={file.name}
                              src={file.preview}
                              width={previewDim}
                              height={previewDim}
                        />
                  </div>
                  }
            </div>
            <div className="form">
                  <Form>
                        <Field
                              type="textarea"
                              name="description"
                              component={CustomInputComponent}
                              placeholder="Description"
                        />
                        <Button
                              type="submit"
                              bsStyle="primary"
                              disabled={isSubmitting}
                              className="pull-right">
                              Submit
                        </Button>
                  </Form>
            </div>
      </div>
);

Component.propTypes = {
      values: PropTypes.object,
      errors: PropTypes.object,
};

export default Component;

