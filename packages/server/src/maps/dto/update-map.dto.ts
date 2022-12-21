import { IsOptional, IsString } from 'class-validator';

export class UpdateMapDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString({ each: true })
  mediaIds?: string[];

  @IsOptional()
  @IsString()
  selectedMediaId?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
