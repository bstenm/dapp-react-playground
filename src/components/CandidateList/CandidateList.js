// import './CandidateList.css';
import styles from './CandidateList.css';
import React from 'react';
import {Link} from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import {Table} from 'react-bootstrap';
import {routes} from '../../config';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';


export const CandidateList = ({candidates, voteFor, requesting}) => (
      <div className={styles.CandidateList} >
            <Table>
                  <thead>
                        <tr>
                              <th>Candidate</th>
                              <th>Votes</th>
                              <th></th>
                        </tr>
                  </thead>
                  <tbody>
                        {sortBy(candidates, ['name']).map( e => (
                        <tr key={e.name}>
                              <td>{e.name}</td>
                              <td>{e.vote}</td>
                              <td>
                                    {! requesting ?
                                    <Glyphicon glyph="plus" onClick={() => voteFor(e.name)}/>:
                                    <img src="./loading.gif" alt="processing"/>
                                    }
                              </td>
                              <td>
                                    <Link to={routes.candidateInfo(e.name)}>
                                          Add info
                                    </Link>
                              </td>
                        </tr>
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
                  requesting: PropTypes.bool
            }),
      ),
      voteFor: PropTypes.func.isRequired
};

export default CandidateList;

