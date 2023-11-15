import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendCampaignInviteEmailDto {
  @IsOptional()
  @IsString()
  inviteeName?: string;

  @IsString()
  hostName: string;

  @IsString()
  campaignName: string;

  @IsEmail()
  to: string;

  @IsString()
  token: string;
}
