import './UserAccount.css';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';


export const UserAccount = ({account: {tokens, address, votingRecord}}) => (
      <div className="UserAccount" >
            <div className="userInfo">
                  <div><Glyphicon glyph="user"/>
                        <span  title={address}>
                              {address.slice(0, 15)}...
                        </span>
                  </div>
                  <div><Glyphicon glyph="usd"/>{tokens} tokens left</div>
            </div>
            {! isEmpty(votingRecord) &&
            <div className="votingRecord">
                  <h5>Voting record</h5>
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

UserAccount.propTypes = {
      account: PropTypes.shape({
            tokens: PropTypes.number,
            address: PropTypes.string,
            votingRecord: PropTypes.object
      }).isRequired
};

export default UserAccount;

