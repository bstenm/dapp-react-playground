import ms from '../../config/messages';
import * as yup from 'yup';

export default yup.object({
      description: yup
            .string()
            .min(20)
            .max(500)
            .required(ms.requiredField)
});