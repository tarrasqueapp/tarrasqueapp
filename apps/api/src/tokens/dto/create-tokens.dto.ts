import { ValidateNested } from 'class-validator';

import { TokenBaseEntity } from '../entities/token-base.entity';

export class CreateTokensDto {
  @ValidateNested({ each: true })
  tokens: TokenBaseEntity[];
}
