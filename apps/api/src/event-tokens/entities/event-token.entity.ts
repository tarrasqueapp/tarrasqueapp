import { EventToken, EventTokenType, Prisma } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsJSON, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../campaigns/entities/campaign.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class EventTokenEntity implements EventToken {
  @IsString()
  id: string;

  @IsEnum(EventTokenType)
  type: EventTokenType;

  @IsEmail()
  email: string;

  @IsJSON()
  payload: Prisma.JsonValue;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsDateString()
  expiresAt: Date;

  // User
  @IsOptional()
  @ValidateNested()
  user?: UserEntity | null;

  @IsOptional()
  @IsString()
  userId: string | null;

  // Campaign
  @IsOptional()
  @ValidateNested()
  campaign?: CampaignEntity | null;

  @IsOptional()
  @IsString()
  campaignId: string | null;
}
