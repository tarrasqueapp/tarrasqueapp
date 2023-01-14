import { IsOptional, IsString } from 'class-validator';

export class CampaignInviteDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  campaignId: string;
}
