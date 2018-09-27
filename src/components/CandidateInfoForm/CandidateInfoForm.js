// [TODO]: Deal with preview memory leaks
import './CandidateInfoForm.css';
import React from 'react';
import PropTypes from 'prop-types';
import CandidateInfoFormFields from '../CandidateInfoFormFields';
import CandidateInfoAttachment from '../CandidateInfoAttachment';

export const CandidateInfoForm = ({ ...props, isSubmitting }) => (
      <div className="CandidateInfoForm" >
            <CandidateInfoAttachment {...props} />
            <CandidateInfoFormFields isSubmitting={isSubmitting} />
      </div>
);

CandidateInfoForm.propTypes = {
      props: PropTypes.object,
      isSubmitting: PropTypes.bool,
};

export default CandidateInfoForm;

