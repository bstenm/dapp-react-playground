import React from 'react';
import PropTypes from 'prop-types';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

const CustomInputComponent = ({
      type,
      field: { value, name },
      form: { handleChange, errors, touched },
}) => (
      <FormGroup controlId={name}>
            <ControlLabel>Description</ControlLabel>
            <FormControl
                  value={value}
                  onChange={handleChange}
                  componentClass={type}
            />
            {errors[name] && touched[name] && (
                  <div className="input-error">{errors[name]}</div>
            )}
      </FormGroup>
);

CustomInputComponent.propTypes = {};

export default CustomInputComponent;

