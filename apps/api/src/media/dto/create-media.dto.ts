import { Media } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto implements Partial<Media> {
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

  @IsOptional()
  @IsString()
  createdById?: string;
}
