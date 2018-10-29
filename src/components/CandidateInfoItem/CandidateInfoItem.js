import './CandidateInfoItem.css';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { ipfsRoot, attachment } from '../../config';

const CandidateInfoItem = ({ item: { fileHash, title, description } }) => (
      <div className="flex CandidateInfoItem">
            <div className="attachment">
                  {!fileHash ? (
                        <div className="file-placeholder">NO DOC</div>
                  ) : (
                        <Link to={`${ipfsRoot}${fileHash}`} target="__blank">
                              <img
                                    alt="attachment"
                                    src={`${ipfsRoot}${fileHash}`}
                                    width={attachment.listingDim}
                                    height={attachment.listingDim}
                              />
                        </Link>
                  )}
            </div>
            <div className="text">
                  <h4>{capitalize(title)}</h4>
                  <p>{description}</p>
            </div>
      </div>
);

CandidateInfoItem.propTypes = {
      item: PropTypes.shape({
            title: PropTypes.string.isRequired,
            fileHash: PropTypes.string,
            description: PropTypes.string
      }).isRequired
};

export default CandidateInfoItem;
