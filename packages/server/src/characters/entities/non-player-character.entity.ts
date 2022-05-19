import { ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../campaigns/entities/campaign.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { NonPlayerCharacterBaseEntity } from './non-player-character-base.entity';

export class NonPlayerCharacterEntity extends NonPlayerCharacterBaseEntity {
  // Created by
  @ValidateNested()
  createdBy: UserEntity;
  // Campaign
  @ValidateNested()
  campaign: CampaignEntity;
}
