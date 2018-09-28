import React from 'react';
import {connect} from 'react-redux';
import Component from './FileUpload';

export class FileUploadContainer extends React.Component {

render() {
return (
<Component {...this.props} />
);
}
};

export default connect(null, null)(FileUploadContainer);

