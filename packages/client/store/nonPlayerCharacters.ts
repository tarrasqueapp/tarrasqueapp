import { makeAutoObservable } from 'mobx';

import {
  AbilityInterface,
  AlignmentEnum,
  ArmorClassInterface,
  CampaignInterface,
  CharacterSizeEnum,
  HitPointsInterface,
  MediaInterface,
  MovementInterface,
  NonPlayerCharacterInterface,
  SensesInterface,
  SkillInterface,
  TokenInterface,
  UserInterface,
} from '../lib/types';

export class NonPlayerCharacterEntity implements NonPlayerCharacterInterface {
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

  constructor(props: NonPlayerCharacterInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class NonPlayerCharacterStore {
  entities: NonPlayerCharacterEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const nonPlayerCharacterStore = new NonPlayerCharacterStore();
