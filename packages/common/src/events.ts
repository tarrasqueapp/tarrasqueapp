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

// The event names that the socket can emit and listen for
export enum SocketEvent {
  // Global
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',

  // Users
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  JOIN_USER_ROOM = 'JOIN_USER_ROOM',
  LEAVE_USER_ROOM = 'LEAVE_USER_ROOM',

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
  LEAVE_CAMPAIGN_ROOM = 'LEAVE_CAMPAIGN_ROOM',

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

  // Maps
  MAP_CREATED = 'MAP_CREATED',
  MAP_UPDATED = 'MAP_UPDATED',
  MAP_DELETED = 'MAP_DELETED',
  MAPS_REORDERED = 'MAPS_REORDERED',
  PINGED_LOCATION = 'PINGED_LOCATION',
  JOIN_MAP_ROOM = 'JOIN_MAP_ROOM',
  LEAVE_MAP_ROOM = 'LEAVE_MAP_ROOM',
  PING_LOCATION = 'PING_LOCATION',
}

// The events that the socket can listen for
export interface SocketListenEvents {
  // Users
  [SocketEvent.USER_UPDATED]: (data: UserEntity) => void;
  [SocketEvent.USER_DELETED]: (data: UserEntity) => void;

  // Notifications
  [SocketEvent.NOTIFICATION_CREATED]: (data: NotificationEntity) => void;
  [SocketEvent.NOTIFICATION_UPDATED]: (data: NotificationEntity) => void;
  [SocketEvent.NOTIFICATION_DELETED]: (data: NotificationEntity) => void;

  // Campaigns
  [SocketEvent.CAMPAIGN_CREATED]: (data: CampaignEntity) => void;
  [SocketEvent.CAMPAIGN_UPDATED]: (data: CampaignEntity) => void;
  [SocketEvent.CAMPAIGN_DELETED]: (data: CampaignEntity) => void;
  [SocketEvent.CAMPAIGNS_REORDERED]: (data: string[]) => void;

  // Invites
  [SocketEvent.INVITE_CREATED]: (data: ActionTokenEntity) => void;
  [SocketEvent.INVITE_UPDATED]: (data: ActionTokenEntity) => void;
  [SocketEvent.INVITE_DELETED]: (data: ActionTokenEntity) => void;

  // Memberships
  [SocketEvent.MEMBERSHIP_CREATED]: (data: MembershipEntity) => void;
  [SocketEvent.MEMBERSHIP_UPDATED]: (data: MembershipEntity) => void;
  [SocketEvent.MEMBERSHIP_DELETED]: (data: MembershipEntity) => void;

  // Characters
  [SocketEvent.CHARACTER_CREATED]: (data: CharacterEntity) => void;
  [SocketEvent.CHARACTER_UPDATED]: (data: CharacterEntity) => void;
  [SocketEvent.CHARACTER_DELETED]: (data: CharacterEntity) => void;

  // Maps
  [SocketEvent.MAP_CREATED]: (data: MapEntity) => void;
  [SocketEvent.MAP_UPDATED]: (data: MapEntity) => void;
  [SocketEvent.MAP_DELETED]: (data: MapEntity) => void;
  [SocketEvent.MAPS_REORDERED]: (data: { campaignId: string; mapIds: string[] }) => void;
  [SocketEvent.PINGED_LOCATION]: (data: PingLocationEntity) => void;
}

// The events that the socket can emit
export interface SocketEmitEvents {
  // Users
  [SocketEvent.JOIN_USER_ROOM]: () => void;
  [SocketEvent.LEAVE_USER_ROOM]: () => void;

  // Campaigns
  [SocketEvent.JOIN_CAMPAIGN_ROOM]: (campaignId: string) => void;
  [SocketEvent.LEAVE_CAMPAIGN_ROOM]: (campaignId: string) => void;

  // Maps
  [SocketEvent.JOIN_MAP_ROOM]: (mapId: string) => void;
  [SocketEvent.LEAVE_MAP_ROOM]: (mapId: string) => void;
  [SocketEvent.PING_LOCATION]: (data: PingLocationEntity) => void;
}
