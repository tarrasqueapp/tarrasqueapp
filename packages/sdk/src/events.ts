import { CharacterEntity } from './types';

// The event names that the Tarrasque SDK can emit and listen for
export enum TarrasqueEvent {
  /**
   * Campaigns
   */
  // Emitters
  JOIN_CAMPAIGN_ROOM = 'JOIN_CAMPAIGN_ROOM',

  // Listeners
  CAMPAIGN_CREATED = 'CAMPAIGN_CREATED',
  CAMPAIGN_UPDATED = 'CAMPAIGN_UPDATED',
  CAMPAIGN_DELETED = 'CAMPAIGN_DELETED',

  /**
   * Maps
   */
  // Emitters
  JOIN_MAP_ROOM = 'JOIN_MAP_ROOM',

  // Listeners
  MAP_CREATED = 'MAP_CREATED',
  MAP_UPDATED = 'MAP_UPDATED',
  MAP_DELETED = 'MAP_DELETED',

  /**
   * Characters
   */
  // Emitters
  CREATE_CHARACTER = 'CREATE_CHARACTER',
  UPDATE_CHARACTER = 'UPDATE_CHARACTER',
  DELETE_CHARACTER = 'DELETE_CHARACTER',

  // Listeners
  CHARACTER_CREATED = 'CHARACTER_CREATED',
  CHARACTER_UPDATED = 'CHARACTER_UPDATED',
  CHARACTER_DELETED = 'CHARACTER_DELETED',

  /**
   * Users
   */
  // Emitters
  JOIN_USER_ROOM = 'JOIN_USER_ROOM',

  // Listeners
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',

  /**
   * Memberships
   */
  // Listeners
  MEMBERSHIP_CREATED = 'MEMBERSHIP_CREATED',
  MEMBERSHIP_UPDATED = 'MEMBERSHIP_UPDATED',
  MEMBERSHIP_DELETED = 'MEMBERSHIP_DELETED',

  /**
   * Invites
   */

  // Listeners
  INVITE_CREATED = 'INVITE_CREATED',
  INVITE_UPDATED = 'INVITE_UPDATED',
  INVITE_DELETED = 'INVITE_DELETED',
}

// The events that the Tarrasque SDK can listen for
export interface TarrasqueListenEvents {
  // Characters
  [TarrasqueEvent.CHARACTER_CREATED]: (data: CharacterEntity) => void;
  [TarrasqueEvent.CHARACTER_UPDATED]: (data: CharacterEntity) => void;
  [TarrasqueEvent.CHARACTER_DELETED]: (data: CharacterEntity) => void;
}

// The events that the Tarrasque SDK can emit
export interface TarrasqueEmitEvents {
  // Characters
  [TarrasqueEvent.CREATE_CHARACTER]: (data: CharacterEntity) => void;
  [TarrasqueEvent.UPDATE_CHARACTER]: (data: CharacterEntity) => void;
  [TarrasqueEvent.DELETE_CHARACTER]: (data: CharacterEntity) => void;
}
