import './CandidateInfoFormFields.css';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Form, Field } from 'formik';
import Loader from '../Loader';
import CustomInputComponent from '../CustomInputComponent';

const CandidateInfoFormFields = ({ isSubmitting }) => (
      <div className="CandidateInfoFormFields">
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
                        disabled={isSubmitting}
                        className="pull-right"
                  >
                        {!isSubmitting ? 'Submit' : <Loader />}
                  </Button>
            </Form>
      </div>
);

CandidateInfoFormFields.propTypes = {
      isSubmitting: PropTypes.bool.isRequired
};

export default CandidateInfoFormFields;
