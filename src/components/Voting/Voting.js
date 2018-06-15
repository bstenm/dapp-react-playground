import './Voting.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateList from '../CandidateList';


const Voting  = ({voteFor, candidates, requesting }) => (
      <div className="Voting">
            <CandidateList
                  voteFor={voteFor}
                  candidates={candidates}
                  requesting={requesting}
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
