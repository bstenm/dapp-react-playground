import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as ms from '../../config/messages';
import CandidateList from './CandidateList';

export class VotingContainer extends React.Component {
      constructor(props) {
            super(props);
            this.props.dispatch.candidates.fetchVotes();
      }

      voteFor = name => {
            const { loading, user, dispatch } = this.props;
            const { error } = dispatch.alert;
            if (loading) return;
            if (user.tokens < 1) {
                  error(ms.notEnoughFunds);
                  return;
            }
            dispatch.candidates.addVote(name);
      };

      render() {
            return (
                  <CandidateList
                        voteFor={this.voteFor}
                        candidates={this.props.candidates}
                        loading={this.props.loading}
                  />
            );
      }
}

VotingContainer.defaultProps = {
      loading: false
};

VotingContainer.propTypes = {
      dispatch: PropTypes.shape({
            alert: PropTypes.shape({
                  error: PropTypes.func.isRequired
            }).isRequired,
            candidates: PropTypes.shape({
                  addVote: PropTypes.func.isRequired,
                  fetchVotes: PropTypes.func.isRequired
            }).isRequired
      }).isRequired,
      candidates: PropTypes.array.isRequired,
      loading: PropTypes.bool,
      user: PropTypes.shape({
            tokens: PropTypes.number
      }).isRequired
};

export default connect(({ user, loading, candidates }) => ({
      user,
      loading,
      candidates
}))(VotingContainer);
