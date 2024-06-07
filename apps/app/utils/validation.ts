import { z } from 'zod';

const manifestUrl = z
  .string()
  .url()
  .min(1)
  .regex(/^https?:\/\/.+\/manifest(-.+)?\.json$/, 'Must be a manifest.json file');

const campaignMemberRole = z.enum(['GAME_MASTER', 'PLAYER']);
const setupStep = z.enum(['CREATED_DATABASE', 'CREATED_USER', 'COMPLETED']);
const gridType = z.enum(['SQUARE', 'HEX_HORIZONTAL', 'HEX_VERTICAL']);

export const validation = {
  // Common fields
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

    manifestUrl,
    campaignMemberRole,
    setupStep,
    gridType,
  },

  // Form schemas
  schemas: {
    auth: {
      signUp: z.object({
        name: z.string().min(1),
        email: z.string().email().toLowerCase(),
        inviteId: z.string().uuid().nullable(),
        turnstileToken: z.string().nullable(),
      }),
      signIn: z.object({ email: z.string().email().toLowerCase() }),
      updateUser: z.object({ email: z.string().email().toLowerCase() }),
    },
    campaigns: {
      createCampaign: z.object({ name: z.string().min(1) }),
      updateCampaign: z.object({ id: z.string().uuid(), name: z.string().min(1) }),
      deleteCampaign: z.object({ id: z.string().uuid() }),
      reorderCampaigns: z.object({ campaignIds: z.array(z.string().uuid()) }),
    },
    email: {
      sendTransactionalEmail: z.object({ to: z.string().email(), subject: z.string().min(1), html: z.string().min(1) }),
      sendWelcomeEmail: z.object({
        firstName: z.string().min(1),
        to: z.string().email(),
        verifyEmailUrl: z.string().url(),
      }),
      sendEmailVerificationEmail: z.object({
        firstName: z.string().min(1),
        to: z.string().email(),
        verifyEmailUrl: z.string().url(),
      }),
      sendCampaignInviteNewUserEmail: z.object({
        hostName: z.string().min(1),
        campaignName: z.string().min(1),
        to: z.string().email(),
        signUpUrl: z.string().url(),
      }),
      sendCampaignInviteExistingUserEmail: z.object({
        hostName: z.string().min(1),
        inviteeName: z.string().min(1),
        campaignName: z.string().min(1),
        to: z.string().email(),
        acceptInviteUrl: z.string().url(),
      }),
      sendMagicLinkEmail: z.object({
        firstName: z.string().min(1),
        to: z.string().email(),
        magicLinkUrl: z.string().url(),
      }),
    },
    grids: {
      createGrid: z.object({
        type: gridType,
        width: z.number(),
        height: z.number(),
        offset_x: z.number(),
        offset_y: z.number(),
        color: z.string(),
        snap: z.boolean(),
        visible: z.boolean(),
        map_id: z.string().uuid(),
        campaign_id: z.string().uuid(),
      }),
      updateGrid: z.object({
        id: z.string().uuid(),
        type: gridType.optional(),
        width: z.number().min(5).optional(),
        height: z.number().min(5).optional(),
        offset_x: z.number().optional(),
        offset_y: z.number().optional(),
        color: z.string().optional(),
        snap: z.boolean().optional(),
        visible: z.boolean().optional(),
        map_id: z.string().uuid().optional(),
      }),
    },
    invites: {
      createInvite: z.object({ campaign_id: z.string().uuid(), email: z.string().email().toLowerCase() }),
      deleteInvite: z.object({ id: z.string().uuid() }),
      acceptInvite: z.object({ id: z.string().uuid() }),
    },
    maps: {
      createMap: z.object({ name: z.string().min(1), campaign_id: z.string().uuid(), media_id: z.string().uuid() }),
      duplicateMap: z.object({ id: z.string().uuid() }),
      updateMap: z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        visible: z.boolean().optional(),
        campaign_id: z.string().uuid().optional(),
        media_id: z.string().uuid().optional(),
      }),
      deleteMap: z.object({ id: z.string().uuid() }),
      reorderMaps: z.object({ campaignId: z.string().uuid(), mapIds: z.array(z.string().uuid()) }),
    },
    media: {
      createMedia: z.object({
        id: z.string().uuid(),
        url: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
        size: z.number(),
      }),
    },
    memberships: {
      getUserCampaignMemberships: z.object({ role: campaignMemberRole.optional() }),
      updateMembership: z.object({
        id: z.string().uuid(),
        color: z.string().optional(),
        role: campaignMemberRole.optional(),
      }),
      deleteMembership: z.object({ id: z.string().uuid() }),
    },
    plugins: {
      installPlugin: z.object({ manifest_url: manifestUrl }),
      uninstallPlugin: z.object({ id: z.string().uuid() }),
      enableCampaignPlugin: z.object({ campaign_id: z.string().uuid(), plugin_id: z.string().uuid() }),
      disableCampaignPlugin: z.object({ id: z.string().uuid() }),
    },
    profiles: {
      updateProfile: z.object({ name: z.string().optional(), avatar_id: z.string().uuid().nullable().optional() }),
    },
    setup: {
      updateSetup: z.object({ step: setupStep }),
    },
    storage: {
      deleteStorageObject: z.object({ url: z.string().min(1) }),
    },
  },
};
