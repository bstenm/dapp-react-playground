import React from 'react';
import {connect} from 'react-redux';
import Component from './CandidateFactForm';

export class CandidateFactFormContainer extends React.Component {

render() {
return (
<Component {...this.props} />
);
}
};

export default connect(null, null)(CandidateFactFormContainer);

