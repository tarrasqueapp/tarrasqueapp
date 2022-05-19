import { Campaign } from '@prisma/client';
import { IsDateString, IsString } from 'class-validator';

export class CampaignBaseEntity implements Campaign {
  @IsString()
  id: string;
  @IsString()
  name: string;
  // DateTime
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
  // Created by
  @IsString()
  createdById: string;
}
