import './CandidateInfoAttachment.css';
import cf from '../../config';
import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import {Glyphicon, ControlLabel} from 'react-bootstrap';

const { allowedTypes, maxSize, previewDim } = cf.attachment;

export const Component = ({
      file,
      onDropRejected,
      onDropAccepted
}) => (
      <div className="CandidateInfoAttachment" >
            <ControlLabel>Attachment</ControlLabel>
            <Dropzone
                  accept={ allowedTypes.join( ',' ) }
                  maxSize={ maxSize }
                  className="dropzone"
                  onDropRejected={onDropRejected}
                  rejectClassName="unauthorized"
                  acceptClassName="authorized"
                  onDropAccepted={onDropAccepted}>
                  <div>
                        <span className="text">IPFS</span>
                        <Glyphicon glyph="paperclip" title="Click or Drop"/>
                  </div>
            </Dropzone>
            { file &&
            <div>
                  <img
                        alt={file.name}
                        src={file.preview}
                        width={previewDim}
                        height={previewDim}
                  />
            </div>
            }
      </div>
);

Component.propTypes = {
      file: PropTypes.object,
      onDropRejected: PropTypes.func,
      onDropAccepted: PropTypes.func.isRequired
};

export default Component;

