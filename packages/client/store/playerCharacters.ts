import { makeAutoObservable } from 'mobx';

import {
  AbilityInterface,
  AlignmentEnum,
  ArmorClassInterface,
  CampaignInterface,
  CharacterSizeEnum,
  CurrenciesInterface,
  HitPointsInterface,
  MediaInterface,
  MovementInterface,
  PlayerCharacterInterface,
  SensesInterface,
  SkillInterface,
  TokenInterface,
  UserInterface,
} from '../lib/types';

export class PlayerCharacterEntity implements PlayerCharacterInterface {
  id = '';
  name = '';
  size = CharacterSizeEnum.Medium;
  alignment = AlignmentEnum.LawfulGood;
  // DateTime
  createdAt = '';
  updatedAt = '';
  // Armor Class
  armorClass = null as unknown as ArmorClassInterface;
  // Hit Points
  hitPoints = null as unknown as HitPointsInterface;
  // Movement
  movement = null as unknown as MovementInterface;
  // Senses
  senses = null as unknown as SensesInterface;
  // Currencies
  currencies = null as unknown as CurrenciesInterface;
  // Abilities
  abilities = [] as AbilityInterface[];
  // Skills
  skills = [] as SkillInterface[];
  // Tokens
  tokens = [] as TokenInterface[];
  // Media
  media = null as unknown as MediaInterface;
  mediaId = '';
  // Created by
  createdBy = null as unknown as UserInterface;
  createdById = '';
  // Controlled by
  controlledBy = [] as UserInterface[];
  // Campaign
  campaign = null as unknown as CampaignInterface;
  campaignId = '';

  constructor(props: PlayerCharacterInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class PlayerCharacterStore {
  entities: PlayerCharacterEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const playerCharacterStore = new PlayerCharacterStore();
