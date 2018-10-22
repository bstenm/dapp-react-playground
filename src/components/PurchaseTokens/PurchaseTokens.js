import './PurchaseTokens.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button  } from 'react-bootstrap';


export const PurchaseTokens = ({value, onChange, onSubmit}) => (
      <div className="PurchaseTokens">
            <Form inline>
                  <FormControl
                        type="number"
                        value={value}
                        onChange={onChange}
                        className="FormControl"
                        placeholder="Amount"
                  />
                  <Button onClick={onSubmit}>Buy</Button>
            </Form>
            </div>
);

PurchaseTokens.defaultProps = {
      value: ''
};

PurchaseTokens.propTypes = {
      value: PropTypes.string,
      onSubmit: PropTypes.func.isRequired,
      onChange:PropTypes.func.isRequired
};

export default PurchaseTokens;

