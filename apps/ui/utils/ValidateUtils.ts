import * as yup from 'yup';

export class ValidateUtils {
  static Name = yup.string().trim().required('Name is required');

  static Email = yup.string().lowercase().trim().email('Invalid email address').required('Email is required');

  static Password = yup
    .string()
    .trim()
    .min(8, 'Password must have at least 8 characters')
    .required('Password is required');

  static UppyFile = yup
    .object({
      id: yup.string().min(1).required(),
      name: yup.string().min(1).required(),
      type: yup.string().min(1).required(),
      extension: yup.string().min(1).required(),
      size: yup.number().min(0).required(),
      uploadURL: yup.string().min(1).required(),
      data: yup.mixed().required(),
      isRemote: yup.boolean().required(),
      meta: yup.object({ name: yup.string().min(1).required() }).required(),
    })
    .required();

  static Media = yup
    .object({
      id: yup.string().min(1).required(),
      url: yup.string().min(1).required(),
      thumbnailUrl: yup.string().min(1).required(),
      width: yup.number().min(0).required(),
      height: yup.number().min(0).required(),
      size: yup.number().min(0).required(),
      format: yup.string().min(1).required(),
      extension: yup.string().min(1).required(),
    })
    .required();
}
