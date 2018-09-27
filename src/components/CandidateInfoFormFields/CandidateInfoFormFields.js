import './CandidateInfoFormFields.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Field} from 'formik';
import CustomInputComponent from '../CustomInputComponent';
import {Button, Glyphicon, ControlLabel} from 'react-bootstrap';

export const CandidateInfoFormFields = ({ isSubmitting }) => (
      <div className="CandidateInfoFormFields" >
            <Form>
                  <Field
                        type="textarea"
                        name="title"
                        component={CustomInputComponent}
                        placeholder="Title"
                  />
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
);

CandidateInfoFormFields.propTypes = {};

export default CandidateInfoFormFields;

