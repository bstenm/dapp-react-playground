import './CandidateInfoFormFields.css';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Form, Field } from 'formik';
import CustomInputComponent from '../CustomInputComponent';

export const CandidateInfoFormFields = ({ isSubmitting }) => (
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
                    bsStyle="primary"
                    disabled={isSubmitting}
                    className="pull-right"
                  >
                        Submit
                  </Button>
            </Form>
      </div>
);

CandidateInfoFormFields.defaultProps = {
      isSubmitting: false,
};

CandidateInfoFormFields.propTypes = {
      isSubmitting: PropTypes.bool.isRequired,
};

export default CandidateInfoFormFields;
