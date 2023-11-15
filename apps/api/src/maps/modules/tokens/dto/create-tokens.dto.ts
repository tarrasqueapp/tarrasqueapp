import { ValidateNested } from 'class-validator';

import { TokenEntity } from '../entities/token.entity';

export class CreateTokensDto {
  @ValidateNested({ each: true })
  tokens: TokenEntity[];
}
