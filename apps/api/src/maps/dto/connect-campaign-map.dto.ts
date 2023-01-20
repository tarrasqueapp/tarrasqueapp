import { IsString } from 'class-validator';

export class ConnectCampaignMapDto {
  @IsString()
  campaignId: string;

  @IsString()
  mapId: string;
}
