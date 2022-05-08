import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ConnectCampaignDto } from 'src/campaigns/dto/connect-campaign.dto';

import { CampaignsService } from '../campaigns/campaigns.service';
import { UserDecorator } from '../common/decorators/user.decorator';
import { ConnectCampaignMapDto } from '../maps/dto/connect-campaign-map.dto';
import { ConnectMapDto } from '../maps/dto/connect-map.dto';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { DeleteTokensDto } from './dto/delete-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { TokenBaseEntity } from './entities/token-base.entity';
import { TokenEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService, private readonly campaignsService: CampaignsService) {}

  /**
   * Get all tokens for a map
   */
  @Get()
  @ApiOkResponse({ status: 200, type: [TokenEntity] })
  async getTokens(@Param() { mapId }: ConnectMapDto): Promise<TokenEntity[]> {
    return this.tokensService.getMapTokens(mapId);
  }

  /**
   * Create tokens on a map
   */
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: [TokenEntity] })
  async createTokens(
    @Param() { campaignId, mapId }: ConnectCampaignMapDto,
    @Body() data: CreateTokensDto,
    @UserDecorator() user: User,
  ): Promise<TokenEntity[]> {
    // User must be the creator of the campaign or a player
    const campaign = await this.campaignsService.getCampaign(campaignId);
    if (campaign.createdById !== user.id && !campaign.players.some((player) => player.id === user.id)) {
      throw new ForbiddenException("You don't have permission to create tokens in this campaign");
    }
    // Create the tokens
    return this.tokensService.createTokens(data.tokens, mapId, user.id);
  }

  /**
   * Update tokens on a map
   */
  @Put()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: [TokenBaseEntity] })
  async updateTokens(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() data: UpdateTokensDto,
    @UserDecorator() user: User,
  ): Promise<TokenBaseEntity[]> {
    // User must be the creator of the campaign or a player
    const campaign = await this.campaignsService.getCampaign(campaignId);
    if (campaign.createdById !== user.id && !campaign.players.some((player) => player.id === user.id)) {
      throw new ForbiddenException("You don't have permission to update this token");
    }
    // Create the tokens
    return this.tokensService.updateTokens(data.tokens);
  }

  /**
   * Delete tokens on a map
   */
  @Delete()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: [TokenBaseEntity] })
  async deleteTokens(@Body() data: DeleteTokensDto, @UserDecorator() user: User): Promise<TokenBaseEntity[]> {
    // Get the tokens
    const tokenIds = data.tokens.map((token) => token.id);
    const tokens = await this.tokensService.getTokens(tokenIds);
    // Check if user is a controlling player of the character
    tokens.forEach((token) => {
      const userIds = [
        token.createdById,
        token.playerCharacter?.controlledBy.map((user) => user.id),
        token.nonPlayerCharacter?.controlledBy.map((user) => user.id),
      ].filter(Boolean);
      if (!userIds.includes(user.id)) {
        throw new ForbiddenException("You don't have permission to delete this token");
      }
    });
    // Delete the tokens
    return this.tokensService.deleteTokens(tokenIds);
  }
}
