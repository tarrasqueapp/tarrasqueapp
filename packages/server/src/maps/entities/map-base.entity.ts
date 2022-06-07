import { Map } from '@prisma/client';
import { IsDateString, IsString, ValidateNested } from 'class-validator';

import { MediaEntity } from '../../media/entities/media.entity';

export class MapBaseEntity implements Map {
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
  @ValidateNested()
  media: MediaEntity;

  @IsString()
  mediaId: string | null;

  // Campaign
  @IsString()
  campaignId: string;

  // Created by
  @IsString()
  createdById: string;
}
