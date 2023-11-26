import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { User } from '../../../users/decorators/user.decorator';
import { UserEntity } from '../../../users/entities/user.entity';
import { CampaignsService } from '../../campaigns.service';
import { ConnectCampaignDto } from '../../dto/connect-campaign.dto';
import { RoleGuard } from '../../guards/role.guard';
import { ConnectCampaignUserDto } from './dto/connect-campaign-user.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipEntity } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';

@UseGuards(JwtAuthGuard)
@Controller('campaigns/:campaignId/memberships')
export class MembershipsController {
  constructor(
    private membershipsService: MembershipsService,
    private campaignsService: CampaignsService,
  ) {}

  /**
   * Get a campaign's memberships
   * @param params - The campaign's id
   * @returns The campaign's memberships
   */
  @Get()
  async getMemberships(@Param() params: ConnectCampaignDto): Promise<MembershipEntity[] | undefined> {
    return await this.membershipsService.getCampaignMemberships(params.campaignId);
  }

  /**
   * Update a campaign user
   * @param params - The campaign's id and user's id
   * @param data - The user's data
   * @returns The updated user
   */
  @UseGuards(RoleGuard(Role.GAME_MASTER))
  @Put(':userId')
  async updateMembership(
    @Param() params: ConnectCampaignUserDto,
    @Body() data: UpdateMembershipDto,
    @User() user: UserEntity,
  ): Promise<MembershipEntity> {
    // Check that user is in the campaign
    const memberships = await this.membershipsService.getUserMemberships(params.userId);
    const membership = memberships.find((membership) => membership.campaignId === params.campaignId);
    if (!membership) {
      throw new BadRequestException('User not in campaign');
    }

    // Check that the user is not trying to promote or demote themselves
    if (user.id === params.userId && membership.role !== data.role) {
      throw new BadRequestException('Cannot change current user role');
    }

    // Update the user
    return this.membershipsService.updateMembership(params.userId, params.campaignId, data);
  }

  /**
   * Remove a user from a campaign
   * @param params - The campaign's id and user's id
   * @returns The deleted membership
   */
  @UseGuards(RoleGuard(Role.GAME_MASTER))
  @Delete(':userId')
  async deleteMembership(@Param() params: ConnectCampaignUserDto, @User() user: UserEntity): Promise<MembershipEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check that user is in the campaign
    const memberships = await this.membershipsService.getUserMemberships(params.userId);
    const membership = memberships.find((membership) => membership.campaignId === params.campaignId);
    if (!membership) {
      throw new BadRequestException('User not in campaign');
    }

    // Check if the user is the current user
    if (user.id === params.userId) {
      // Check that the user is not the last admin
      const memberships = await this.membershipsService.getCampaignMemberships(params.campaignId);
      const admins = memberships.filter((membership) => membership.role === Role.GAME_MASTER);
      if (admins.length === 1) {
        throw new BadRequestException('Cannot delete the last Game Master');
      }
    }

    // Remove the user from the campaign
    return this.membershipsService.deleteMembership(params.userId, params.campaignId);
  }
}
