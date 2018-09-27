import './CandidateList.css';
import React from 'react';
import sortBy from 'lodash/sortBy';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import CandidateListRow from '../CandidateListRow';

export const CandidateList = ({candidates, voteFor, loading}) => (
      <div className="CandidateList" >
            <Table>
                  <thead>
                        <tr>
                              <th>Candidate</th>
                              <th>Votes</th>
                              <th></th>
                        </tr>
                  </thead>
                  <tbody>
                        {sortBy(candidates, ['name']).map((candidate, i) => (
                              <CandidateListRow
                                    key={i}
                                    loading={loading}
                                    candidate={candidate}
                              />
                        ))}
                  </tbody>
            </Table>
      </div>
);

CandidateList.propTypes = {
      candidates: PropTypes.arrayOf(
            PropTypes.shape({
                  vote: PropTypes.string,
                  name: PropTypes.string,
                  loading: PropTypes.bool
            }),
      ),
      voteFor: PropTypes.func.isRequired
};

export default CandidateList;

