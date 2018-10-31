import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../store';
import asPage from '../../hoc/AsPage';
import CandidateInfoList from './CandidateInfoList';

const { select, getState } = store;

export class CandidateInfoListContainer extends React.Component {
      componentWillMount() {
            const { candidate } = this.props.match.params;
            this.props.fetchInfo(candidate);
      }

      render() {
            const {
                  loading,
                  match: {
                        params: { candidate }
                  }
            } = this.props;
            // selector
            const info = select.candidates.getInfoFor(getState())(candidate);
            return (
                  <CandidateInfoList
                        list={info}
                        candidate={candidate}
                        loading={loading}
                  />
            );
      }
}

CandidateInfoListContainer.defaultProps = {
      loading: false
};

CandidateInfoListContainer.propTypes = {
      fetchInfo: PropTypes.func.isRequired,
      loading: PropTypes.bool,
      match: PropTypes.shape({
            params: PropTypes.shape({
                  candidate: PropTypes.string
            }).isRequired
      }).isRequired
};

export default connect(
      ({ loading }) => ({ loading }),
      ({ candidates: { fetchInfo } }) => ({ fetchInfo })
)(asPage(CandidateInfoListContainer));
