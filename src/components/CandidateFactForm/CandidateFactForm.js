import './CandidateFactForm.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Field} from 'formik';
import {FormControl} from 'react-bootstrap';

const CustomInputComponent = ({
      field,
      form: { touched, errors },
      ...props
}) => (
      <div>
            <FormControl type="text" {...field} {...props} />
            {touched[field.name] && errors[field.name] && (
                  <div className="error">{errors[field.name]}</div>
            )}
      </div>
);

export const Component = ({values, errors, touched, isSubmitting}) => (
      <div className="CandidateFactForm" >
            <Form>
                  <Field type="email" name="email" placeholder="Email" component={CustomInputComponent}/>
                  <Field type="password" name="password" placeholder="Password" component={CustomInputComponent}/>
                  <br/>
                 <label>
                       <Field type="checkbox" name="newsletter" checked={values.newsletter}/>
                       Join our newsletter
                  </label>
                  <Field component="select" name="plan">
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                  </Field>
                  <button type="submit" disabled={isSubmitting}>Submit</button>
            </Form>
      </div>
);

Component.propTypes = {
      values: PropTypes.object,
      errors: PropTypes.object,
};

export default Component;

