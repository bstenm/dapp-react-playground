import store from '../../store';
import React from 'react';
import {connect} from 'react-redux';
import Component from './CandidateInfoList';

const { select, getState } = store;

export class CandidateInfoListContainer extends React.Component {

      componentWillMount() {
            const { candidate } = this.props.match.params;
            this.props.fetchInfo(candidate);
      }

      render() {
            const { candidate } = this.props.match.params;
            const info = this.props.getInfoFor(candidate);
            console.log('INFO =>>', info);
            return (
                  <Component list={info} />
            );
      }
};

export default connect(select(
      ({ candidates: { getInfoFor }}) => ({ getInfoFor })),
      ({ candidates: { fetchInfo }}) => ({ fetchInfo })
)(CandidateInfoListContainer);

