import React from 'react'
import * as ms from '../../config/messages';
import {connect} from 'react-redux';
import Component from './Voting';

export class VotingContainer extends React.Component {

      constructor (props) {
            super(props)
            this.props.dispatch.candidates.fetchVotes();
      }

      voteFor = name => {
            const {loading, user, dispatch} = this.props;
            const {error} = dispatch.alert;
            if (loading) return;
            if (user.tokens < 1) {
                  return error(ms.notEnoughFunds);
            }
            dispatch.candidates.addVote(name);
            dispatch.user.updateTokenCount(-1);
            dispatch.user.addVoteToRecord({name, vote: 1});
      }

      render() {
            const {candidates, loading} = this.props;
            return (
                  <Component
                        voteFor={this.voteFor}
                        candidates={candidates}
                        loading={loading}
                  />
            );
      }
};

export default connect(
      ({ user, loading, candidates }) =>
      ({ user, loading, candidates })
)(VotingContainer);
