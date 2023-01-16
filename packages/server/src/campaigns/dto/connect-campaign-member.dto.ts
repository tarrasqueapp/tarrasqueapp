import { IsString } from 'class-validator';

export class ConnectCampaignMemberDto {
  @IsString()
  campaignId: string;

  @IsString()
  memberId: string;
}
