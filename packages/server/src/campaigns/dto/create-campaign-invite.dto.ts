import { IsOptional, IsString } from 'class-validator';

export class CreateCampaignInviteDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  campaignId: string;
}
