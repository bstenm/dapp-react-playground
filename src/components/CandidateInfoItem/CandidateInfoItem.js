import './CandidateInfoItem.css';
import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import {ipfsRoot, attachment} from '../../config';

export const CandidateInfoItem = ({ item }) => (
      <div className="flex CandidateInfoItem">
            <div className="attachment">
                  <Link to={`${ipfsRoot}${item.fileHash}`} target="__blank">
                        <img
                              alt="attachment"
                              src={`${ipfsRoot}${item.fileHash}`}
                              width={attachment.listingDim}
                              height={attachment.listingDim}
                        />
                  </Link>
            </div>
            <div className="text">
                  <h4>{capitalize(item.title)}</h4>
                  <p>{item.description}</p>
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

