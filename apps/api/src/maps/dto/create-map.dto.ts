import { IsOptional, IsString } from 'class-validator';

export class CreateMapDto {
  @IsString()
  name: string;

  @IsString({ each: true })
  mediaIds: string[];

  @IsString()
  selectedMediaId: string;

  @IsString()
  campaignId: string;

  @IsOptional()
  @IsString()
  createdById: string;
}
