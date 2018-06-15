import './SignIn.css';
import React from 'react';
import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Form, FormControl, Button  } from 'react-bootstrap';

export const Component = ({show, value, onChange, onSubmit}) => (
      <div className="SignIn" >
            <Modal show={show}>
                  <Modal.Body>
                        <Form inline>
                              <FormControl
                                    type="text"
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Your name"
                                    style={{marginRight:"5px"}}
                              />
                              <Button onClick={onSubmit}>Login</Button>
                        </Form>
                  </Modal.Body>
            </Modal>
      </div>
);

Component.propTypes = {
      show: PropTypes.bool,
      value: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired
};

export default Component;

