import { ValidateNested } from 'class-validator';

import { TokenEntity } from '../entities/token.entity';

export class DeleteTokensDto {
  @ValidateNested({ each: true })
  tokens: TokenEntity[];
}
