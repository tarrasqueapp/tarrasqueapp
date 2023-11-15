import { Character } from '@prisma/client';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../campaigns/entities/campaign.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class CharacterEntity implements Character {
  @IsString()
  id: string;

  @IsString()
  name: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Media
  @IsOptional()
  @ValidateNested({ each: true })
  media: MediaEntity[];

  @IsString()
  selectedMediaId: string;

  // Created by
  @IsString()
  createdById: string;

  @IsOptional()
  @ValidateNested()
  createdBy?: UserEntity;

  // Controlled by
  @IsOptional()
  @ValidateNested({ each: true })
  controlledBy?: UserEntity[];

  // Campaign
  @IsString()
  campaignId: string;

  @IsOptional()
  @ValidateNested()
  campaign?: CampaignEntity;
}
