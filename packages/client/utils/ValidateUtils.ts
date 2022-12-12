import { z } from 'zod';

export class ValidateUtils {
  static Name = z.string().min(1);

  static Email = z.string().min(1).email();

  static Password = z.string().min(8);

  static File = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    extension: z.string().min(1),
    size: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  });

  static Media = z.object({
    id: z.string().min(1),
    url: z.string().min(1),
    thumbnailUrl: z.string().min(1),
    width: z.number().min(0),
    height: z.number().min(0),
    size: z.number().min(0),
    format: z.string().min(1),
    extension: z.string().min(1),
  });
}
