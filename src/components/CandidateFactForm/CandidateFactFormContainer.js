import * as yup from 'yup';
import React from 'react';
import Component from './CandidateFactForm';
import {withFormik} from 'formik';

export class CandidateFactFormContainer extends React.Component {

      render() {
            return (
                  <Component {...this.props} />
            );
      }
};

export default withFormik({
      mapPropsToValues () {
            return {
                  email: 'andrew@yo.io',
                  password: '',
                  newsletter: false,
                  plan: 'premium'
            }
      },
      handleSubmit (values, {resetForm, setErrors, setSubmitting}) {
            console.log('>>>>', values);
            setTimeout(() => {
                  if (values.email === 'andrew@test.io') {
                        setErrors({ email: 'Email already taken'});
                  } else {
                        resetForm();
                  }
                  setSubmitting(false);
            }, 2000)
      },
      validationSchema: yup.object().shape({
            email: yup.string().email('Invalid').required('Required'),
            password: yup.string().min(9, 'Password must be 9 characters or longer').required('Required')
      })
})(CandidateFactFormContainer);

