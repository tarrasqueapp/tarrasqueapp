import { ValidateNested } from 'class-validator';

import { NonPlayerCharacterBaseEntity } from '../../characters/entities/non-player-character-base.entity';
import { PlayerCharacterBaseEntity } from '../../characters/entities/player-character-base.entity';
import { TokenBaseEntity } from './token-base.entity';

export class TokenEntity extends TokenBaseEntity {
  // Player Character
  @ValidateNested()
  playerCharacter: PlayerCharacterBaseEntity;
  // Non Player Character
  @ValidateNested()
  nonPlayerCharacter: NonPlayerCharacterBaseEntity;
}
