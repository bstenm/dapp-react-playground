// [TODO]: Deal with preview memory leaks
import './CandidateInfoForm.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateInfoFormFields from '../CandidateInfoFormFields';
import CandidateInfoAttachment from '../CandidateInfoAttachment';

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

export default CandidateInfoForm;
