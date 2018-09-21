import './Alert.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Glyphicon} from 'react-bootstrap';

export const Component = ({ message, type, onClose }) => (
      <div className="Alert" >
            <Alert bsStyle={ type }>
                  <span className="pull-left">
                        { message }
                  </span>
                  <Glyphicon
                        glyph="remove"
                        onClick={onClose}
                        className="pull-right"
                  />
            </Alert>
      </div>
);

Component.propTypes = { };

export default Component;

