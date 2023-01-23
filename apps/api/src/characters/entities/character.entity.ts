import { ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../campaigns/entities/campaign.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CharacterBaseEntity } from './character-base.entity';

export class CharacterEntity extends CharacterBaseEntity {
  // Created by
  @ValidateNested()
  createdBy: UserEntity;

  // Campaign
  @ValidateNested()
  campaign: CampaignEntity;
}
