import { Membership, Role } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UserEntity } from '../../../../users/entities/user.entity';
import { CampaignEntity } from '../../../entities/campaign.entity';

export class MembershipEntity implements Membership {
  // User
  @IsOptional()
  @ValidateNested()
  user?: UserEntity;

  @IsString()
  userId: string;

  // Campaign
  @IsOptional()
  @ValidateNested()
  campaign?: CampaignEntity;

  @IsString()
  campaignId: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Role
  @IsEnum(Role)
  role: Role;
}
