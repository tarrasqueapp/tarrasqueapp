import { NonPlayerCharacterBaseEntity } from '../../characters/entities/non-player-character-base.entity';
import { PlayerCharacterBaseEntity } from '../../characters/entities/player-character-base.entity';
import { MapBaseEntity } from '../../maps/entities/map-base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CampaignBaseEntity } from './campaign-base.entity';

export class CampaignEntity extends CampaignBaseEntity {
  // Maps
  maps: MapBaseEntity[];
  // Players
  players: UserEntity[];
  // Player Characters
  playerCharacters: PlayerCharacterBaseEntity[];
  // Non Player Characters
  nonPlayerCharacters: NonPlayerCharacterBaseEntity[];
  // Created by
  createdBy: UserEntity;
}
