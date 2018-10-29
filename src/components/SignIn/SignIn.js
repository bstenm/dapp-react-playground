import './SignIn.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button, Modal } from 'react-bootstrap';

const SignIn = ({ show, value, onChange, onLogin }) => (
      <div className="SignIn">
            <Modal show={show}>
                  <Modal.Body>
                        <Form inline>
                              <FormControl
                                    type="text"
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Your ethereum address"
                                    style={{ marginRight: '5px' }}
                              />
                              <Button onClick={onLogin}>Login</Button>
                        </Form>
                  </Modal.Body>
            </Modal>
      </div>
);

SignIn.defaultProps = {
      value: '',
      show: false
};

SignIn.propTypes = {
      show: PropTypes.bool,
      value: PropTypes.string,
      onLogin: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired
};

export default SignIn;
