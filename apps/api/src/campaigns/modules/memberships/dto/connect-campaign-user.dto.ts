import { IsString } from 'class-validator';

export class ConnectCampaignUserDto {
  @IsString()
  campaignId: string;

  @IsString()
  userId: string;
}
