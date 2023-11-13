import { Controller, Get, Param, Query } from '@nestjs/common';

import { ActionTokensService } from './action-tokens.service';
import { ActionTokenTypeDto } from './dto/action-token-type.dto';
import { ConnectActionTokenDto } from './dto/connect-action-token.dto';
import { ActionTokenEntity } from './entities/action-token.entity';

@Controller('action-tokens')
export class ActionTokensController {
  constructor(private actionTokensService: ActionTokensService) {}

  /**
   * Retrieve an action token by id
   * @param params - The action token id
   * @param query - The action token type
   * @returns The action token
   */
  @Get(':actionTokenId')
  async getToken(
    @Param() params: ConnectActionTokenDto,
    @Query() query: ActionTokenTypeDto,
  ): Promise<ActionTokenEntity | null> {
    return await this.actionTokensService.getTokenById(params.actionTokenId, query.type);
  }
}
