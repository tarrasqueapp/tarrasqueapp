import { IsOptional, IsString } from 'class-validator';

export class InstallPluginDto {
  @IsString()
  manifestUrl: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
