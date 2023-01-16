import { IsEmail, IsString } from 'class-validator';

export class SendCampaignInviteExistingUserEmailDto {
  @IsString()
  hostName: string;

  @IsString()
  campaignName: string;

  @IsString()
  inviteeName: string;

  @IsEmail()
  to: string;

  @IsString()
  token: string;
}
