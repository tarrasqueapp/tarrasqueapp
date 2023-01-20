import { ValidateNested } from 'class-validator';

import { NonPlayerCharacterBaseEntity } from '../../characters/entities/non-player-character-base.entity';
import { PlayerCharacterBaseEntity } from '../../characters/entities/player-character-base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CampaignBaseEntity } from './campaign-base.entity';
import { CampaignInviteEntity } from './campaign-invite.entity';
import { CampaignMemberEntity } from './campaign-member.entity';

export class CampaignEntity extends CampaignBaseEntity {
  // Members
  @ValidateNested({ each: true })
  members: CampaignMemberEntity[];

  // Player Characters
  @ValidateNested({ each: true })
  playerCharacters: PlayerCharacterBaseEntity[];

  // Non Player Characters
  @ValidateNested({ each: true })
  nonPlayerCharacters: NonPlayerCharacterBaseEntity[];

  // Created by
  @ValidateNested()
  createdBy: UserEntity;

  // Invites
  @ValidateNested({ each: true })
  invites: CampaignInviteEntity[];
}
