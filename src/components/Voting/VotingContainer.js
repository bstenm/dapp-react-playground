import ms from '../../config/messages';
import React from 'react'
import {connect} from 'react-redux';
import Component from './Voting';

export class VotingContainer extends React.Component {

      constructor (props) {
            super(props)
            this.props.dispatch.candidates.getVotes();
      }

      voteFor = name => {
            const {requesting, user, dispatch} = this.props;
            if (requesting) return;
            if (user.tokens < 1) {
                  dispatch.alert.message(ms.notEnoughFunds);
                  return;
            }
            dispatch.candidates.addVote(name);
            dispatch.user.updateTokenCount(-1);
            dispatch.user.addVoteToRecord({name, vote: 1});
      }

      render() {
            const {candidates, requesting} = this.props;
            return (
                  <Component
                        voteFor={this.voteFor}
                        candidates={candidates}
                        requesting={requesting}
                  />
            );
      }
};

export default connect(
      ({ user, requesting, candidates }) =>
      ({ user, requesting, candidates })
)(VotingContainer);
