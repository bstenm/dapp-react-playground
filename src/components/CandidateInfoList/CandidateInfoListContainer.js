import React from 'react';
import { connect } from "react-redux";
import store from '../../store';
import CandidateInfoList from "./CandidateInfoList";

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

export default connect(
      select(({ candidates: { getInfoFor } }) => ({ getInfoFor })),),
  ({ candidates: { fetchInfo } }) => ({ fetchInfo }),
)(CandidateInfoListContainer);
