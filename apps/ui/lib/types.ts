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

export interface MovementInterface {
  id: string;
  burrow: number;
  climb: number;
  fly: number;
  hover: boolean;
  swim: number;
  walk: number;
}

export interface HitPointsInterface {
  id: string;
  current: number;
  maximum: number;
  temporary: number;
  formula: string;
}

export interface ArmorClassInterface {
  id: string;
  value: number;
  description: string;
}

export interface SensesInterface {
  id: string;
  blindsight: number;
  darkvision: number;
  tremorsense: number;
  truesight: number;
}

export interface AbilityInterface {
  id: string;
  name: string;
  shortName: string;
  score: number;
  modifier: number;
  save: number;
  // Skills
  skills: SkillInterface[];
}

export interface SkillInterface {
  id: string;
  name: string;
  level: number;
  bonus: number;
  // Ability
  ability: AbilityInterface;
  abilityId: string;
}

export interface CurrenciesInterface {
  id: string;
  copper: number;
  silver: number;
  gold: number;
  electrum: number;
  platinum: number;
}

export enum CharacterSizeEnum {
  Tiny = 'Tiny',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  Huge = 'Huge',
  Gargantuan = 'Gargantuan',
}

export enum AlignmentEnum {
  LawfulGood = 'Lawful Good',
  NeutralGood = 'Neutral Good',
  ChaoticGood = 'Chaotic Good',
  LawfulNeutral = 'Lawful Neutral',
  Neutral = 'Neutral',
  ChaoticNeutral = 'Chaotic Neutral',
  LawfulEvil = 'Lawful Evil',
  NeutralEvil = 'Neutral Evil',
  ChaoticEvil = 'Chaotic Evil',
}

export interface PlayerCharacterInterface {
  id: string;
  name: string;
  size: CharacterSizeEnum;
  alignment: AlignmentEnum;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Armor Class
  armorClass: ArmorClassInterface;
  // Hit Points
  hitPoints: HitPointsInterface;
  // Movement
  movement: MovementInterface;
  // Senses
  senses: SensesInterface;
  // Currencies
  currencies: CurrenciesInterface;
  // Abilities
  abilities: AbilityInterface[];
  // Skills
  skills: SkillInterface[];
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

export interface NonPlayerCharacterInterface {
  id: string;
  name: string;
  size: CharacterSizeEnum;
  alignment: AlignmentEnum;
  // DateTime
  createdAt: string;
  updatedAt: string;
  // Armor Class
  armorClass: ArmorClassInterface;
  // Hit Points
  hitPoints: HitPointsInterface;
  // Movement
  movement: MovementInterface;
  // Senses
  senses: SensesInterface;
  // Abilities
  abilities: AbilityInterface[];
  // Skills
  skills: SkillInterface[];
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
  // Player Character
  playerCharacter?: PlayerCharacterInterface;
  playerCharacterId?: string;
  // Non Player Character
  nonPlayerCharacter?: NonPlayerCharacterInterface;
  nonPlayerCharacterId?: string;
}
