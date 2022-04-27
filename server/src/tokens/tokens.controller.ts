import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('')
  @ApiBearerAuth('test')
  @ApiOperation({ summary: 'Get all tokens by user' })
  async getTokens() {
    return this.tokensService.tokens({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific token' })
  async getTokenById(@Param('id') id: string) {
    return this.tokensService.token({ id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete token' })
  async deleteToken(@Param('id') id: string) {
    return this.tokensService.deleteToken({ id });
  }
}
