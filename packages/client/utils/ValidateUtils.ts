import * as yup from 'yup';

export class ValidateUtils {
  static Name = yup.string().min(1).required();

  static Email = yup.string().min(1).email().required();

  static Password = yup.string().min(8).required();

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
