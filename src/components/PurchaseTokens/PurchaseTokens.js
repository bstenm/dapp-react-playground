import './PurchaseTokens.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button } from 'react-bootstrap';
import Loader from '../Loader';

const PurchaseTokens = ({ value, onChange, onSubmit, loading }) => (
      <div className="PurchaseTokens">
            <Form inline>
                  <FormControl
                        type="number"
                        value={value}
                        onChange={onChange}
                        className="FormControl"
                        placeholder="Amount"
                  />
                  <Button onClick={onSubmit}>
                        {loading ? <Loader /> : 'Buy'}
                  </Button>
            </Form>
      </div>
);

PurchaseTokens.defaultProps = {
      value: '',
      loading: false
};

PurchaseTokens.propTypes = {
      value: PropTypes.string,
      loading: PropTypes.bool,
      onSubmit: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired
};

export default PurchaseTokens;
