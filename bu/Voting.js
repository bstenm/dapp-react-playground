import './Voting.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateList from '../CandidateList';

const Voting = ({ voteFor, candidates, loading }) => (
      <div className="Voting">
            <CandidateList
                  voteFor={voteFor}
                  candidates={candidates}
                  loading={loading}
            />
      </div>
);

Voting.defaultProps = {
      loading: false,
      candidates: []
};

Voting.propTypes = {
      voteFor: PropTypes.func.isRequired,
      loading: PropTypes.bool,
      candidates: PropTypes.array
};

export default Voting;
