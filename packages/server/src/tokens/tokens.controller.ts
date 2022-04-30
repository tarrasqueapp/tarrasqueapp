import { Controller, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete token' })
  async deleteToken(@Param('id') id: string) {
    return this.tokensService.deleteToken({ id });
  }
}
