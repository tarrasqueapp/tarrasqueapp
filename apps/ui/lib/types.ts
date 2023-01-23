export enum SetupStep {
  DATABASE = 1,
  USER = 2,
  COMPLETED = 3,
}

export interface SetupInterface {
  step: SetupStep;
  completed: boolean;
}

export interface UserInterface {
  id: string;
  name: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  // Avatar
  avatar?: MediaInterface;
  avatarId?: string;
  // Order of campaigns
  campaignOrder: string[];
  // DateTime
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInviteInterface {
  id: string;
  email: string;
  // DateTime
  createdAt: string;
  // User
  user?: UserInterface;
  userId?: string;
  // Campaign
  campaignId: string;
  campaign?: CampaignInterface;
}

export interface CampaignInterface {
  id: string;
  name: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Members
  members: CampaignMemberInterface[];
  // Created by
  createdBy: UserInterface;
  createdById: string;
  // Invites
  invites: CampaignInviteInterface[];
}

export enum CampaignMemberRole {
  GAME_MASTER = 'GAME_MASTER',
  PLAYER = 'PLAYER',
}

export interface CampaignMemberInterface {
  id: string;
  role: CampaignMemberRole;
  // User
  user: UserInterface;
  userId: string;
  // Campaign
  campaignId: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
}

export interface MapInterface {
  id: string;
  name: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Media
  media: MediaInterface[];
  mediaIds: string[];
  selectedMediaId: string;
  // Campaign
  campaign: CampaignInterface;
  campaignId: string;
  // Created by
  createdBy: UserInterface;
  createdById: string;
}

export interface CharacterInterface {
  id: string;
  name: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Tokens
  tokens: TokenInterface[];
  // Media
  media: MediaInterface[];
  mediaIds: string[];
  // Created by
  createdBy: UserInterface;
  createdById: string;
  // Controlled by
  controlledBy: UserInterface[];
  // Campaign
  campaign: CampaignInterface;
  campaignId: string;
}

export interface DimensionsInterface {
  width: number;
  height: number;
}

export interface FileInterface {
  id: string;
  name: string;
  type: string;
  extension: string;
  size: number;
  width?: number;
  height?: number;
}

export interface MediaInterface {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  extension: string;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Created by
  createdBy: UserInterface;
  createdById: string;
}

export interface TokenInterface {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // User
  createdBy: UserInterface;
  createdById: string;
  // Map
  map: MapInterface;
  mapId: string;
  // Character
  character?: CharacterInterface;
  characterId?: string;
}
