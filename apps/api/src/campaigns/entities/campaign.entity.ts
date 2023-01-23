import { ValidateNested } from 'class-validator';

import { CharacterBaseEntity } from '../../characters/entities/character-base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CampaignBaseEntity } from './campaign-base.entity';
import { CampaignInviteEntity } from './campaign-invite.entity';
import { CampaignMemberEntity } from './campaign-member.entity';

export class CampaignEntity extends CampaignBaseEntity {
  // Members
  @ValidateNested({ each: true })
  members: CampaignMemberEntity[];

  // Characters
  @ValidateNested({ each: true })
  characters: CharacterBaseEntity[];

  // Created by
  @ValidateNested()
  createdBy: UserEntity;

  // Invites
  @ValidateNested({ each: true })
  invites: CampaignInviteEntity[];
}
