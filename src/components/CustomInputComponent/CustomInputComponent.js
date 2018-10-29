import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

const CustomInputComponent = ({
      type,
      field: { value, name },
      form: { handleChange, errors, touched }
}) => (
      <FormGroup controlId={name}>
            <ControlLabel>{capitalize(name)}</ControlLabel>
            <FormControl
                  value={value}
                  onChange={handleChange}
                  componentClass={type}
            />
            {/* eslint-disable indent */
            errors[name] &&
                  touched[name] && (
                        <div className="input-error">{errors[name]}</div>
                  )
            /* eslint-enable indent */
            }
      </FormGroup>
);

CustomInputComponent.propTypes = {
      type: PropTypes.string.isRequired,
      field: PropTypes.shape({
            value: PropTypes.string,
            name: PropTypes.string.isRequired
      }).isRequired,
      form: PropTypes.shape({
            errors: PropTypes.object,
            touched: PropTypes.object,
            handleChange: PropTypes.func
      }).isRequired
};

export default CustomInputComponent;
