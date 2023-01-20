import { ValidateNested } from 'class-validator';

import { UserEntity } from '../../users/entities/user.entity';
import { CampaignMemberBaseEntity } from './campaign-member-base.entity';

export class CampaignMemberEntity extends CampaignMemberBaseEntity {
  // User
  @ValidateNested()
  user: UserEntity;
}
