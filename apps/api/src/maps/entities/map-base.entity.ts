import { Map } from '@prisma/client';
import { IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator';

import { MediaEntity } from '../../media/entities/media.entity';

export class MapBaseEntity implements Map {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  order: number;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Media
  @ValidateNested({ each: true })
  media: MediaEntity[];

  @IsString()
  selectedMediaId: string;

  // Campaign
  @IsString()
  campaignId: string;

  // Created by
  @IsString()
  createdById: string;
}
