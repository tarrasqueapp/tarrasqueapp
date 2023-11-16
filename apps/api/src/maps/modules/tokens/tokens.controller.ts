import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../../campaigns/guards/role.guard';
import { User } from '../../../users/decorators/user.decorator';
import { UserEntity } from '../../../users/entities/user.entity';
import { ConnectMapDto } from '../../dto/connect-map.dto';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { DeleteTokensDto } from './dto/delete-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { TokenEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';

@ApiTags('maps/:mapId/tokens')
@Controller('maps/:mapId/tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  /**
   * Get all tokens for a map
   */
  @Get()
  @ApiOkResponse({ type: [TokenEntity] })
  getTokens(@Param() { mapId }: ConnectMapDto): Promise<TokenEntity[]> {
    return this.tokensService.getMapTokens(mapId);
  }

  /**
   * Create tokens on a map
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.PLAYER))
  @Post()
  @ApiCookieAuth()
  @ApiOkResponse({ type: [TokenEntity] })
  createTokens(
    @Param() { mapId }: ConnectMapDto,
    @Body() data: CreateTokensDto,
    @User() user: UserEntity,
  ): Promise<TokenEntity[]> {
    return this.tokensService.createTokens(data.tokens, mapId, user.id);
  }

  /**
   * Update tokens on a map
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.PLAYER))
  @Put()
  @ApiCookieAuth()
  @ApiOkResponse({ type: [TokenEntity] })
  updateTokens(@Body() data: UpdateTokensDto): Promise<TokenEntity[]> {
    return this.tokensService.updateTokens(data.tokens);
  }

  /**
   * Delete tokens on a map
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.PLAYER))
  @Delete()
  @ApiCookieAuth()
  @ApiOkResponse({ type: [TokenEntity] })
  deleteTokens(@Body() data: DeleteTokensDto): Promise<TokenEntity[]> {
    const tokenIds = data.tokens.map((token) => token.id);
    return this.tokensService.deleteTokens(tokenIds);
  }
}
