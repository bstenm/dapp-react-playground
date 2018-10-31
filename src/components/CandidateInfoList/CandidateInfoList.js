import './CandidateInfoList.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateInfoItem from '../CandidateInfoItem';
import Loader from '../Loader';

const CandidateInfoList = ({ list, candidate, loading }) => (
      <div className="CandidateInfoList">
            <h2>Allegations against {candidate}</h2>
            {// eslint-disable-next-line indent
            loading &&
                  !list.length && (
                        <div className="loader">
                              <Loader />
                        </div>
                  )}
            {!loading && !list.length ? (
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
      list: [],
      loading: false
};

CandidateInfoList.propTypes = {
      list: PropTypes.array,
      loading: PropTypes.bool,
      candidate: PropTypes.string.isRequired
};

export default CandidateInfoList;
