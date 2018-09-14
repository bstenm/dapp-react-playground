import './Alert.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Glyphicon} from 'react-bootstrap';

export const Component = ({alert, handleClose}) => (
      <div className="Alert" >
            <Modal show={!! alert} onHide={handleClose}>
                  <Modal.Header closeButton>
                        <Glyphicon glyph="warning-sign" className="purple"/>
                        &nbsp;&nbsp;
                        <span className="bold purple">
                              {alert}
                        </span>
                  </Modal.Header>
            </Modal>
      </div>
);

Component.propTypes = {
      msg: PropTypes.string,
      handleClose: PropTypes.func.isRequired
};

export default Component;

