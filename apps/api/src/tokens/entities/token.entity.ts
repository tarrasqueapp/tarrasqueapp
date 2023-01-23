import { ValidateNested } from 'class-validator';

import { CharacterBaseEntity } from '../../characters/entities/character-base.entity';
import { TokenBaseEntity } from './token-base.entity';

export class TokenEntity extends TokenBaseEntity {
  // Character
  @ValidateNested()
  character: CharacterBaseEntity;
}
