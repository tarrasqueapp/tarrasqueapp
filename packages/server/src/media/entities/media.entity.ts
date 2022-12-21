import { Media } from '@prisma/client';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class MediaEntity implements Media {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  size: number;

  @IsString()
  format: string;

  @IsString()
  extension: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Created by
  @IsString()
  createdById: string;
}
