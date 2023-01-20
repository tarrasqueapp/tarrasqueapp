import { IsString } from 'class-validator';

export class ConnectCampaignInviteDto {
  @IsString()
  campaignId: string;

  @IsString()
  inviteId: string;
}
