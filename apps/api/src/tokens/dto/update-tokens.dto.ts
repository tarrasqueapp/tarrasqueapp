import { ValidateNested } from 'class-validator';

import { TokenBaseEntity } from '../entities/token-base.entity';

export class UpdateTokensDto {
  @ValidateNested({ each: true })
  tokens: TokenBaseEntity[];
}
