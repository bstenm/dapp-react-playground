import './CandidateListRow.css';
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import { routes } from '../../config';

const CandidateListRow = ({ candidate: { name, vote }, loading, voteFor }) => (
      <tr className="CandidateListRow">
            <td>{name}</td>
            <td>{vote}</td>
            <td>
                  {!loading ? (
                        <Glyphicon glyph="plus" onClick={() => voteFor(name)} />
                  ) : (
                        <img src="./loading.gif" alt="processing" />
                  )}
            </td>
            <td>
                  <Link to={routes.candidateInfoList(name)}>Show info</Link>/
                  <Link to={routes.candidateInfoForm(name)}>Add info</Link>
            </td>
      </tr>
);

CandidateListRow.propTypes = {
      candidate: PropTypes.shape({
            vote: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
      }).isRequired,
      loading: PropTypes.bool.isRequired,
      voteFor: PropTypes.func.isRequired
};

export default CandidateListRow;
