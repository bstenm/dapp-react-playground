import './CandidateInfoList.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateInfoItem from '../CandidateInfoItem';

const CandidateInfoList = ({ list, candidate }) => (
      <div className="CandidateInfoList">
            <h2>Allegations against {candidate}</h2>
            {!list.length ? (
                  <div>No info entered yet for {candidate}</div>
            ) : (
                  <ul>
                        {list.map(item => (
                              <li key={item.title}>
                                    <CandidateInfoItem item={item} />
                              </li>
                        ))}
                  </ul>
            )}
      </div>
);

CandidateInfoList.defaultProps = {
      list: []
};

CandidateInfoList.propTypes = {
      list: PropTypes.array,
      candidate: PropTypes.string.isRequired
};

export default CandidateInfoList;
