import { CampaignInvite } from '@prisma/client';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignBaseEntity } from './campaign-base.entity';

export class CampaignInviteEntity implements Omit<CampaignInvite, 'value'> {
  @IsString()
  id: string;

  @IsString()
  email: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  // User
  @IsString()
  userId: string;

  // Campaign
  @IsString()
  campaignId: string;

  @IsOptional()
  @ValidateNested()
  campaign?: CampaignBaseEntity;
}
