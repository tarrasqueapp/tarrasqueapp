import { CampaignInviteToken } from '@prisma/client';
import { IsDateString, IsString } from 'class-validator';

export class CampaignInviteTokenEntity implements Omit<CampaignInviteToken, 'value'> {
  @IsString()
  id: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  // User
  @IsString()
  userId: string;

  // Campaign
  @IsString()
  campaignId: string;
}
