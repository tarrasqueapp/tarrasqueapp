import { IsString } from 'class-validator';

export class ConnectCampaignPluginDto {
  @IsString()
  campaignId: string;

  @IsString()
  pluginId: string;
}
