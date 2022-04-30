import { makeAutoObservable } from 'mobx';

import {
  MapInterface,
  NonPlayerCharacterInterface,
  PlayerCharacterInterface,
  TokenInterface,
  UserInterface,
} from '../lib/types';

export class TokenEntity implements TokenInterface {
  id = '';
  width = 0;
  height = 0;
  x = 0;
  y = 0;
  // DateTime
  createdAt = '';
  updatedAt = '';
  // Created by
  createdBy = null as unknown as UserInterface;
  createdById = '';
  // Map
  map = null as unknown as MapInterface;
  mapId = '';
  // Player Character
  playerCharacter = null as unknown as PlayerCharacterInterface;
  playerCharacterId = '';
  // Non Player Character
  nonPlayerCharacter = null as unknown as NonPlayerCharacterInterface;
  nonPlayerCharacterId = '';

  constructor(props: TokenInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class TokenStore {
  entities: TokenEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const tokenStore = new TokenStore();
