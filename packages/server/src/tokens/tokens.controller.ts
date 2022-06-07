import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CampaignRole, CampaignRoleGuard } from '../campaigns/guards/campaign-role.guard';
import { ConnectCampaignMapDto } from '../maps/dto/connect-campaign-map.dto';
import { ConnectMapDto } from '../maps/dto/connect-map.dto';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { DeleteTokensDto } from './dto/delete-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { TokenBaseEntity } from './entities/token-base.entity';
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
  @Post()
  @UseGuards(CampaignRoleGuard(CampaignRole.PLAYER))
  @UseGuards(RoleGuard(Role.USER))
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
  @Put()
  @UseGuards(CampaignRoleGuard(CampaignRole.PLAYER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TokenBaseEntity] })
  updateTokens(@Body() data: UpdateTokensDto): Promise<TokenBaseEntity[]> {
    return this.tokensService.updateTokens(data.tokens);
  }

  /**
   * Delete tokens on a map
   */
  @Delete()
  @UseGuards(CampaignRoleGuard(CampaignRole.PLAYER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TokenBaseEntity] })
  deleteTokens(@Body() data: DeleteTokensDto): Promise<TokenBaseEntity[]> {
    const tokenIds = data.tokens.map((token) => token.id);
    return this.tokensService.deleteTokens(tokenIds);
  }
}
