import './Voting.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateList from '../CandidateList';


const Voting  = ({voteFor, candidates, loading }) => (
      <div className="Voting">
            <CandidateList
                  voteFor={voteFor}
                  candidates={candidates}
                  loading={loading}
            />
      </div>
)

Voting.propTypes = {
      candidates: PropTypes.arrayOf(
            PropTypes.shape({
                  vote: PropTypes.string,
                  name: PropTypes.string
            }),
      ),
      voteFor: PropTypes.func.isRequired
};

export default Voting
