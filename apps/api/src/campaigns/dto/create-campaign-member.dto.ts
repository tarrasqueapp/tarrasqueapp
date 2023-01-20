import { IsString } from 'class-validator';

export class CreateCampaignMemberDto {
  @IsString()
  userId: string;

  @IsString()
  campaignId: string;
}
