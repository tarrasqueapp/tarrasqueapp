import { ValidateNested } from 'class-validator';

import { TokenEntity } from '../entities/token.entity';

export class UpdateTokensDto {
  @ValidateNested({ each: true })
  tokens: TokenEntity[];
}
