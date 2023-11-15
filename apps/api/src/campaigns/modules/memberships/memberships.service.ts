import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { serializeUser } from '../../../users/users.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipEntity } from './entities/membership.entity';
import { MembershipsGateway } from './memberships.gateway';

@Injectable()
export class MembershipsService {
  private logger: Logger = new Logger(MembershipsService.name);

  constructor(
    private prisma: PrismaService,
    private membershipsGateway: MembershipsGateway,
  ) {}

  /**
   * Get a campaign's memberships
   * @param campaignId - The campaign's id
   * @returns Campaign memberships
   */
  async getCampaignMemberships(campaignId: string): Promise<MembershipEntity[]> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}" memberships`);
    try {
      // Get the memberships
      const memberships = await this.prisma.membership.findMany({
        where: { campaignId },
        include: { user: { include: { avatar: true } } },
        orderBy: { createdAt: 'asc' },
      });

      // Exclude the password from the user
      memberships.forEach((membership) => {
        membership.user = serializeUser(membership.user);
      });

      this.logger.debug(`✅️ Found campaign "${campaignId}" memberships`);
      return memberships;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a user's memberships
   * @param userId - The user's id
   * @returns User memberships
   */
  async getUserMemberships(userId: string): Promise<MembershipEntity[]> {
    this.logger.verbose(`📂 Getting user "${userId}" memberships`);
    try {
      // Get the memberships
      const memberships = await this.prisma.membership.findMany({
        where: { userId },
        include: { user: { include: { avatar: true } } },
        orderBy: { createdAt: 'asc' },
      });

      // Exclude the password from the user
      memberships.forEach((membership) => {
        membership.user = serializeUser(membership.user);
      });

      this.logger.debug(`✅️ Found user "${userId}" memberships`);
      return memberships;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a membership between a user and a campaign
   * @param data - The membership's data
   * @returns The created membership
   */
  async createMembership(data: CreateMembershipDto): Promise<MembershipEntity> {
    this.logger.verbose(`📂 Creating membership of user "${data.userId}" in campaign "${data.campaignId}"`);
    try {
      // Create the membership
      const membership = await this.prisma.membership.create({
        data,
        include: { user: { include: { avatar: true } } },
      });

      // Exclude the password from the user
      membership.user = serializeUser(membership.user);
      this.membershipsGateway.createMembership(membership);

      this.logger.debug(`✅️ Created membership of user "${data.userId}" in campaign "${data.campaignId}"`);
      return membership;
    } catch (error) {
      this.logger.error(
        `🚨 Failed to create membership of user "${data.userId}" in campaign "${data.campaignId}"`,
        error,
      );
      throw new ConflictException(error.message);
    }
  }

  /**
   * Update a membership
   * @param userId - The user's id
   * @param campaignId - The campaign's id
   * @param data - The membership's data
   * @returns The updated membership
   */
  async updateMembership(userId: string, campaignId: string, data: UpdateMembershipDto): Promise<MembershipEntity> {
    this.logger.verbose(`📂 Updating membership of user "${userId}" in campaign "${campaignId}"`);
    try {
      // Update the membership
      const membership = await this.prisma.membership.update({
        where: { userId_campaignId: { userId, campaignId } },
        data: { ...data },
        include: { user: { include: { avatar: true } } },
      });

      // Exclude the password from the user
      membership.user = serializeUser(membership.user);
      this.membershipsGateway.updateMembership(membership);

      this.logger.debug(`✅️ Updated membership of user "${userId}" in campaign "${campaignId}"`);
      return membership;
    } catch (error) {
      this.logger.error(`🚨 Membership of user "${userId}" in campaign "${campaignId}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a membership
   * @param userId - The user's id
   * @param campaignId - The campaign's id
   * @returns The deleted membership
   */
  async deleteMembership(userId: string, campaignId: string): Promise<MembershipEntity> {
    this.logger.verbose(`📂 Removing user "${userId}" from campaign "${campaignId}"`);
    try {
      // Delete the membership
      const membership = await this.prisma.membership.delete({
        where: { userId_campaignId: { userId, campaignId } },
      });
      this.membershipsGateway.deleteMembership(membership);
      this.logger.debug(`✅️ Removed user "${userId}" from campaign "${campaignId}"`);
      return membership;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }
}
