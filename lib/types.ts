export enum SetupStep {
  DATABASE = 1,
  USER = 2,
  COMPLETED = 3,
}

export class SetupEntity {
  step: SetupStep;
  completed: boolean;
}

export class UserEntity {
  id: string;
  name: string;
  display_name: string;
  email: string;
  isEmailVerified: boolean;
  // Avatar
  avatar?: MediaEntity;
  avatarId?: string;
  // Order of campaigns
  campaignOrder: string[];
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Memberships
  memberships: MembershipEntity[];
}

export enum ActionTokenType {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
  INVITE = 'INVITE',
}

export class ActionTokenEntity {
  id: string;
  type: ActionTokenType;
  email: string;
  payload: Record<string, any>;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  // User
  user?: UserEntity | null;
  userId: string | null;
  // Campaign
  campaign?: CampaignEntity | null;
  campaignId: string | null;
}

export class CampaignEntity {
  id: string;
  name: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Memberships
  memberships: MembershipEntity[];
  // Created by
  createdBy: UserEntity;
  createdById: string;
  // Invites
  invites: ActionTokenEntity[];
  // Maps
  maps: MapEntity[];
  // Plugins
  plugins: PluginEntity[];
}

export enum Role {
  GAME_MASTER = 'GAME_MASTER',
  PLAYER = 'PLAYER',
}

export class MembershipEntity {
  role: Role;
  color: string;
  // User
  user: UserEntity;
  userId: string;
  // Campaign
  campaignId: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
}

export class MapEntity {
  id: string;
  name: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Media
  media: MediaEntity[];
  mediaIds: string[];
  selectedMediaId: string;
  // Campaign
  campaign: CampaignEntity;
  campaignId: string;
  // Created by
  createdBy: UserEntity;
  createdById: string;
  // Tokens
  tokens?: TokenEntity[];
}

export class CharacterEntity {
  id: string;
  name: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Tokens
  tokens?: TokenEntity[];
  // Media
  media?: MediaEntity[];
  selectedMediaId: string;
  // Created by
  createdBy?: UserEntity;
  createdById: string;
  // Controlled by
  controlledBy?: UserEntity[];
  // Campaign
  campaign?: CampaignEntity;
  campaignId: string;
}

export class DimensionsEntity {
  width: number;
  height: number;
}

export class PositionEntity {
  x: number;
  y: number;
}

export class PingLocationEntity {
  id?: string;
  position: PositionEntity;
  color: string;
  mapId: string;
  userId: string;
}

export class FileEntity {
  id: string;
  url: string;
  type: string;
  extension: string;
  size: number;
  width?: number;
  height?: number;
}

export class MediaEntity {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number | null;
  created_at: string;
  user_id: string;
}

export class TokenEntity {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // User
  createdBy: UserEntity;
  createdById: string;
  // Map
  map: MapEntity;
  mapId: string;
  // Character
  character?: CharacterEntity;
  characterId?: string;
}

export enum NotificationTypeEnum {
  INVITE = 'INVITE',
}

export class NotificationEntity {
  userId: string;
  type: NotificationTypeEnum;
  data: { id: string };
}

export class InviteNotificationEntity extends NotificationEntity {
  type = NotificationTypeEnum.INVITE;
  declare data: ActionTokenEntity;
}

export class PluginEntity {
  id: string;
  manifestUrl: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Campaign
  campaign: CampaignEntity;
  campaignId: string;
}

export class SubmittedPluginEntity {
  id: string;
  name: string;
  manifest_url: string;
}

export class ManifestEntity {
  id: string;
  name: string;
  description: string;
  author: string;
  homepage_url: string;
  plugin_url: string;
  icon: string;
  iframe: {
    width: number;
    height: number;
  };
}
