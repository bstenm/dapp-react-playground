import './PurchaseTokens.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button  } from 'react-bootstrap';


export const Component = ({value, onChange, onSubmit}) => (
      <div className="PurchaseTokens" style={{width:"150px"}}>
            <Form inline>
                  <FormControl
                        type="number"
                        value={value}
                        onChange={onChange}
                        placeholder="Amount"
                        style={{width:"90px", marginRight:"5px"}}
                  />
                  <Button onClick={onSubmit}>Buy</Button>
            </Form>
            </div>
);

Component.propTypes = {
      value: PropTypes.string,
      onSubmit: PropTypes.func.isRequired,
      onChange:PropTypes.func.isRequired
};

export default Component;

