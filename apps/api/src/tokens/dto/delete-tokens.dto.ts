import { ValidateNested } from 'class-validator';

import { TokenBaseEntity } from '../entities/token-base.entity';

export class DeleteTokensDto {
  @ValidateNested({ each: true })
  tokens: TokenBaseEntity[];
}
