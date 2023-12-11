import { z } from 'zod';

export class ValidateUtils {
  static fields = {
    uppyFile: z.object({
      name: z.string().min(1),
      type: z.string().min(1).optional(),
      extension: z.string().min(1),
      size: z.number().min(0),
      data: z.union([z.instanceof(Blob), z.instanceof(File)]),
      meta: z.object({ objectName: z.string().min(1).optional() }).optional(),
      uploadURL: z.string().min(1),
    }),
    media: z.object({
      id: z.string().min(1),
      url: z.string().min(1),
      width: z.number().min(0).nullable(),
      height: z.number().min(0).nullable(),
      size: z.number().min(0).nullable(),
      created_at: z.string().min(1),
      user_id: z.string().min(1),
    }),
  };
}
