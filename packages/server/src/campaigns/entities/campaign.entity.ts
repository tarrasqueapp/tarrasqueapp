import { ValidateNested } from 'class-validator';

import { NonPlayerCharacterBaseEntity } from '../../characters/entities/non-player-character-base.entity';
import { PlayerCharacterBaseEntity } from '../../characters/entities/player-character-base.entity';
import { MapBaseEntity } from '../../maps/entities/map-base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CampaignBaseEntity } from './campaign-base.entity';

export class CampaignEntity extends CampaignBaseEntity {
  // Maps
  @ValidateNested({ each: true })
  maps: MapBaseEntity[];
  // Players
  @ValidateNested({ each: true })
  players: UserEntity[];
  // Player Characters
  @ValidateNested({ each: true })
  playerCharacters: PlayerCharacterBaseEntity[];
  // Non Player Characters
  @ValidateNested({ each: true })
  nonPlayerCharacters: NonPlayerCharacterBaseEntity[];
  // Created by
  @ValidateNested()
  createdBy: UserEntity;
}
