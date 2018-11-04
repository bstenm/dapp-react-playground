// [TODO]: Deal with preview memory leaks
import React from 'react';
import PropTypes from 'prop-types';
import asPage from '../../hoc/AsPage';
import CandidateInfoFormFields from '../CandidateInfoFormFields';
import CandidateInfoAttachment from '../CandidateInfoAttachment';
import './CandidateInfoForm.css';

const CandidateInfoForm = ({ isSubmitting, ...props }) => (
      <div className="CandidateInfoForm">
            <CandidateInfoAttachment {...props} />
            <CandidateInfoFormFields isSubmitting={isSubmitting} />
      </div>
);

CandidateInfoForm.defaultProps = {
      props: {},
      isSubmitting: false
};

CandidateInfoForm.propTypes = {
      props: PropTypes.object,
      isSubmitting: PropTypes.bool
};

export default asPage(CandidateInfoForm);
