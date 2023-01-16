import { IsEmail, IsString } from 'class-validator';

export class SendCampaignInviteNewUserEmailDto {
  @IsString()
  hostName: string;

  @IsString()
  campaignName: string;

  @IsEmail()
  to: string;

  @IsString()
  token: string;
}
