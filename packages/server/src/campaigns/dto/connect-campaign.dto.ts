import { IsString } from 'class-validator';

export class ConnectCampaignDto {
  @IsString()
  campaignId: string;
}
