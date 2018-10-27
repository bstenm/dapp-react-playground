import * as yup from 'yup';
import * as ms from '../../config/messages';

export default yup.object({
      title: yup
            .string()
            .min(5)
            .max(120)
            .required(ms.requiredField),
      description: yup
            .string()
            .min(20)
            .max(500)
            .required(ms.requiredField),
});
