import { CampaignMember, CampaignMemberRole } from '@prisma/client';
import { IsDateString, IsEnum, IsString } from 'class-validator';

export class CampaignMemberBaseEntity implements CampaignMember {
  @IsString()
  id: string;

  @IsEnum(CampaignMemberRole)
  role: CampaignMemberRole;

  // User
  @IsString()
  userId: string;

  // Campaign
  @IsString()
  campaignId: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
