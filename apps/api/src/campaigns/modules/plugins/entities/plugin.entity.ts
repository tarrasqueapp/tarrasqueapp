import { Plugin } from '@prisma/client';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../../entities/campaign.entity';

export class PluginEntity implements Plugin {
  @IsString()
  id: string;

  @IsString()
  manifestUrl: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Campaign
  @IsOptional()
  @ValidateNested()
  campaign?: CampaignEntity | null;

  @IsString()
  campaignId: string;
}
