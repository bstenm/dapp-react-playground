import "./Alert.css";
import React from "react";
import PropTypes from "prop-types";
import { Alert, Glyphicon } from 'react-bootstrap';

export const Component = ({ alert: { message, type }, silence }) => (
  <div className="Alert">
        {!message ? <div />
            : <Alert bsStyle={type}>
              <span className="pull-left">
                    { message }
                  </span>
              <Glyphicon
                              glyph="remove"
                    onClick={silence}
                              className="pull-right"
                        />
                  </Alert>
            )}
      </div>
);

Component.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  silence: PropTypes.func.isRequired,
};

export default Component;
