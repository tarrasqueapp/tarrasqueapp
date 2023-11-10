import { Map } from '@prisma/client';
import { IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../campaigns/entities/campaign.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { TokenEntity } from '../../tokens/entities/token.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class MapEntity implements Map {
  @IsString()
  id: string;

  @IsString()
  name: string;

  // Order
  @IsNumber()
  order: number;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Media
  @IsOptional()
  @ValidateNested({ each: true })
  media?: MediaEntity[];

  @IsString()
  selectedMediaId: string;

  // Campaign
  @IsOptional()
  @ValidateNested()
  campaign?: CampaignEntity;

  @IsString()
  campaignId: string;

  // Created by
  @IsOptional()
  @ValidateNested()
  createdBy?: UserEntity;

  @IsString()
  createdById: string;

  // Tokens
  @IsOptional()
  @ValidateNested({ each: true })
  tokens?: TokenEntity[];
}
