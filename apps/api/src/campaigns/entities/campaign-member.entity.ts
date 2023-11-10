import { CampaignMember, CampaignMemberRole } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UserEntity } from '../../users/entities/user.entity';
import { CampaignEntity } from './campaign.entity';

export class CampaignMemberEntity implements CampaignMember {
  @IsString()
  id: string;

  @IsEnum(CampaignMemberRole)
  role: CampaignMemberRole;

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
}
