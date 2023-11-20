import {
  ActionTokenEntity,
  CampaignEntity,
  CharacterEntity,
  MapEntity,
  MembershipEntity,
  NotificationEntity,
  PingLocationEntity,
  UserEntity,
} from './types';

// The event names that the Tarrasque SDK can emit and listen for
export enum TarrasqueEvent {
  // Global
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',

  // Users
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  JOIN_USER_ROOM = 'JOIN_USER_ROOM',

  // Notifications
  NOTIFICATION_CREATED = 'NOTIFICATION_CREATED',
  NOTIFICATION_UPDATED = 'NOTIFICATION_UPDATED',
  NOTIFICATION_DELETED = 'NOTIFICATION_DELETED',

  // Campaigns
  CAMPAIGN_CREATED = 'CAMPAIGN_CREATED',
  CAMPAIGN_UPDATED = 'CAMPAIGN_UPDATED',
  CAMPAIGN_DELETED = 'CAMPAIGN_DELETED',
  CAMPAIGNS_REORDERED = 'CAMPAIGNS_REORDERED',
  JOIN_CAMPAIGN_ROOM = 'JOIN_CAMPAIGN_ROOM',

  // Invites
  INVITE_CREATED = 'INVITE_CREATED',
  INVITE_UPDATED = 'INVITE_UPDATED',
  INVITE_DELETED = 'INVITE_DELETED',

  // Memberhips
  MEMBERSHIP_CREATED = 'MEMBERSHIP_CREATED',
  MEMBERSHIP_UPDATED = 'MEMBERSHIP_UPDATED',
  MEMBERSHIP_DELETED = 'MEMBERSHIP_DELETED',

  // Characters
  CHARACTER_CREATED = 'CHARACTER_CREATED',
  CHARACTER_UPDATED = 'CHARACTER_UPDATED',
  CHARACTER_DELETED = 'CHARACTER_DELETED',
  CREATE_CHARACTER = 'CREATE_CHARACTER',
  UPDATE_CHARACTER = 'UPDATE_CHARACTER',
  DELETE_CHARACTER = 'DELETE_CHARACTER',

  // Maps
  MAP_CREATED = 'MAP_CREATED',
  MAP_UPDATED = 'MAP_UPDATED',
  MAP_DELETED = 'MAP_DELETED',
  PINGED_LOCATION = 'PINGED_LOCATION',
  JOIN_MAP_ROOM = 'JOIN_MAP_ROOM',
  PING_LOCATION = 'PING_LOCATION',
}

// The events that the Tarrasque SDK can listen for
export interface TarrasqueListenEvents {
  // Users
  [TarrasqueEvent.USER_UPDATED]: (data: UserEntity) => void;
  [TarrasqueEvent.USER_DELETED]: (data: UserEntity) => void;

  // Notifications
  [TarrasqueEvent.NOTIFICATION_CREATED]: (data: NotificationEntity) => void;
  [TarrasqueEvent.NOTIFICATION_UPDATED]: (data: NotificationEntity) => void;
  [TarrasqueEvent.NOTIFICATION_DELETED]: (data: NotificationEntity) => void;

  // Campaigns
  [TarrasqueEvent.CAMPAIGN_CREATED]: (data: CampaignEntity) => void;
  [TarrasqueEvent.CAMPAIGN_UPDATED]: (data: CampaignEntity) => void;
  [TarrasqueEvent.CAMPAIGN_DELETED]: (data: CampaignEntity) => void;
  [TarrasqueEvent.CAMPAIGNS_REORDERED]: (data: string[]) => void;

  // Invites
  [TarrasqueEvent.INVITE_CREATED]: (data: ActionTokenEntity) => void;
  [TarrasqueEvent.INVITE_UPDATED]: (data: ActionTokenEntity) => void;
  [TarrasqueEvent.INVITE_DELETED]: (data: ActionTokenEntity) => void;

  // Memberships
  [TarrasqueEvent.MEMBERSHIP_CREATED]: (data: MembershipEntity) => void;
  [TarrasqueEvent.MEMBERSHIP_UPDATED]: (data: MembershipEntity) => void;
  [TarrasqueEvent.MEMBERSHIP_DELETED]: (data: MembershipEntity) => void;

  // Characters
  [TarrasqueEvent.CHARACTER_CREATED]: (data: CharacterEntity) => void;
  [TarrasqueEvent.CHARACTER_UPDATED]: (data: CharacterEntity) => void;
  [TarrasqueEvent.CHARACTER_DELETED]: (data: CharacterEntity) => void;

  // Maps
  [TarrasqueEvent.MAP_CREATED]: (data: MapEntity) => void;
  [TarrasqueEvent.MAP_UPDATED]: (data: MapEntity) => void;
  [TarrasqueEvent.MAP_DELETED]: (data: MapEntity) => void;
  [TarrasqueEvent.PINGED_LOCATION]: (data: PingLocationEntity) => void;
}

// The events that the Tarrasque SDK can emit
export interface TarrasqueEmitEvents {
  // Users
  [TarrasqueEvent.JOIN_USER_ROOM]: (userId: string) => void;

  // Campaigns
  [TarrasqueEvent.JOIN_CAMPAIGN_ROOM]: (campaignId: string) => void;

  // Characters
  [TarrasqueEvent.CREATE_CHARACTER]: (data: CharacterEntity) => void;
  [TarrasqueEvent.UPDATE_CHARACTER]: (data: CharacterEntity) => void;
  [TarrasqueEvent.DELETE_CHARACTER]: (data: CharacterEntity) => void;

  // Maps
  [TarrasqueEvent.JOIN_MAP_ROOM]: (mapId: string) => void;
  [TarrasqueEvent.PING_LOCATION]: (data: PingLocationEntity) => void;
}
