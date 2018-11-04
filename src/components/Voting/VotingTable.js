import './VotingTable.css';
import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Table, Alert } from 'react-bootstrap';
import CandidateListRow from '../CandidateListRow';

const VotingTable = ({ candidates, voteFor, loading }) => (
      <div className="VotingTable">
            <Alert bsStyle="info">
                  Here you can vote for who is the most corrupt politician in
                  the world
            </Alert>
            <Table>
                  <thead>
                        <tr>
                              <th>Candidate</th>
                              <th>Votes</th>
                              <th />
                        </tr>
                  </thead>
                  <tbody>
                        {sortBy(candidates, ['name']).map(candidate => (
                              <CandidateListRow
                                    key={candidate.name}
                                    loading={loading}
                                    voteFor={voteFor}
                                    candidate={candidate}
                              />
                        ))}
                  </tbody>
            </Table>
      </div>
);

VotingTable.defaultProps = {
      loading: false
};

VotingTable.propTypes = {
      loading: PropTypes.bool,
      voteFor: PropTypes.func.isRequired,
      candidates: PropTypes.array.isRequired
};

export default VotingTable;
