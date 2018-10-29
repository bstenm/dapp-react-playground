import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../store';
import asPage from '../../hoc/AsPage';
import CandidateInfoList from './CandidateInfoList';

const { select } = store;

export class CandidateInfoListContainer extends React.Component {
      componentWillMount() {
            const { candidate } = this.props.match.params;
            this.props.fetchInfo(candidate);
      }

      render() {
            const { candidate } = this.props.match.params;
            // selector
            const info = this.props.getInfoFor(candidate);
            return <CandidateInfoList list={info} candidate={candidate} />;
      }
}

CandidateInfoListContainer.propTypes = {
      fetchInfo: PropTypes.func.isRequired,
      getInfoFor: PropTypes.func.isRequired,
      match: PropTypes.shape({
            params: PropTypes.shape({
                  candidate: PropTypes.string
            }).isRequired
      }).isRequired
};

export default connect(
      select(({ candidates: { getInfoFor } }) => ({ getInfoFor })),
      ({ candidates: { fetchInfo } }) => ({ fetchInfo })
)(asPage(CandidateInfoListContainer));
