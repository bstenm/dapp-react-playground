import './CandidateInfoList.css';
import {Link} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import {ipfsRoot, attachment} from '../../config';

export const Component = ({ list , candidate }) => (
      <div className="CandidateInfoList">
            <h2>Allegations against {candidate}</h2>
            { ! list.length ?
            <div>No info entered yet for {candidate}</div> :
            <ul>
                  {list.map((item, i) => (
                        <li key={i} className="flex">
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
                        </li>
                  ))}
            </ul>
            }
      </div>
);

Component.propTypes = {};

export default Component;

