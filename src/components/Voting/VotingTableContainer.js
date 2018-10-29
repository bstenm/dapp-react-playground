import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as ms from '../../config/messages';
import VotingTable from './VotingTable';

export class VotingTableContainer extends React.Component {
      constructor(props) {
            super(props);
            this.props.fetchVotes();
      }

      voteFor = name => {
            const { loading, user } = this.props;
            if (loading) return;
            if (user.tokens < 1) {
                  this.props.showError(ms.notEnoughFunds);
                  return;
            }
            this.props.addVote(name);
      };

      render() {
            return (
                  <VotingTable
                        voteFor={this.voteFor}
                        candidates={this.props.candidates}
                        loading={this.props.loading}
                  />
            );
      }
}

VotingTableContainer.defaultProps = {
      loading: false
};

VotingTableContainer.propTypes = {
      fetchVotes: PropTypes.func.isRequired,
      addVote: PropTypes.func.isRequired,
      showError: PropTypes.func.isRequired,
      candidates: PropTypes.array.isRequired,
      loading: PropTypes.bool,
      user: PropTypes.shape({
            tokens: PropTypes.number
      }).isRequired
};

export default connect(
      ({ user, loading, candidates }) => ({ user, loading, candidates }),
      ({ candidates: { fetchVotes, addVote }, alert: { error } }) => ({
            fetchVotes,
            addVote,
            showError: error
      })
)(VotingTableContainer);
