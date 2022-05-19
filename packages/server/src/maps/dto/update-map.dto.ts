import { IsOptional, IsString } from 'class-validator';

export class UpdateMapDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  mediaId?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
