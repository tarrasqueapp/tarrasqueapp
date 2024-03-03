import { z } from 'zod';

export const validate = {
  fields: {
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

    manifestUrl: z
      .string()
      .url()
      .min(1)
      .regex(/^https?:\/\/.+\/manifest(-.+)?\.json$/, 'Must be a manifest.json file'),

    campaignMemberRole: z.enum(['GAME_MASTER', 'PLAYER']),

    setupStep: z.enum(['CREATED_DATABASE', 'CREATED_USER', 'COMPLETED']),

    gridType: z.enum(['SQUARE', 'HEX_HORIZONTAL', 'HEX_VERTICAL']),
  },
};
