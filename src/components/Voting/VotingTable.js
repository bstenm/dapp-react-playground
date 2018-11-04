import './VotingTable.css';
import React from 'react';
import sortBy from 'lodash/sortBy';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import asPage from '../../hoc/AsPage';
import CandidateListRow from '../CandidateListRow';

const VotingTable = ({ candidates, voteFor, loading }) => (
      <div className="VotingTable">
            <p className="directive">
                  Here you can vote for who is the most corrupt politician in
                  the world
            </p>
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

export default asPage(VotingTable);
