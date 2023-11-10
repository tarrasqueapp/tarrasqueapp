import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CampaignMemberRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignRoleGuard } from '../campaigns/guards/campaign-role.guard';
import { ConnectCampaignMapDto } from '../maps/dto/connect-campaign-map.dto';
import { ConnectMapDto } from '../maps/dto/connect-map.dto';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { DeleteTokensDto } from './dto/delete-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { TokenEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

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
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.PLAYER))
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TokenEntity] })
  createTokens(
    @Param() { mapId }: ConnectCampaignMapDto,
    @Body() data: CreateTokensDto,
    @User() user: UserEntity,
  ): Promise<TokenEntity[]> {
    return this.tokensService.createTokens(data.tokens, mapId, user.id);
  }

  /**
   * Update tokens on a map
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.PLAYER))
  @Put()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TokenEntity] })
  updateTokens(@Body() data: UpdateTokensDto): Promise<TokenEntity[]> {
    return this.tokensService.updateTokens(data.tokens);
  }

  /**
   * Delete tokens on a map
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.PLAYER))
  @Delete()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TokenEntity] })
  deleteTokens(@Body() data: DeleteTokensDto): Promise<TokenEntity[]> {
    const tokenIds = data.tokens.map((token) => token.id);
    return this.tokensService.deleteTokens(tokenIds);
  }
}
