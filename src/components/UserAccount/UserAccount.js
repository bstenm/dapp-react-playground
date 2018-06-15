import './UserAccount.css';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';


export const Component = ({account: {tokens, id, name, votingRecord}}) => (
      <div className="UserAccount" >
            <div><Glyphicon glyph="user"/> {name}</div>
            <div><Glyphicon glyph="usd"/> {tokens} tokens left</div>
            {! isEmpty(votingRecord) &&
            <div>
                  <hr/>
                  <h4>Your votes</h4>
                  <table>
                        <tbody>
                              {Object.keys(votingRecord).map(k => (
                              <tr key={k}>
                                    <td>{k}: </td>
                                    <td>{votingRecord[k]}</td>
                              </tr>
                              ))}
                        </tbody>
                  </table>
            </div>}
      </div>
);

Component.propTypes = {
      account: PropTypes.shape({
            tokens: PropTypes.number,
            votingRecord: PropTypes.object
      }).isRequired
};

export default Component;

