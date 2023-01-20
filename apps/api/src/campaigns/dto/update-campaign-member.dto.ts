import { CampaignMemberRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateCampaignMemberDto {
  @IsEnum(CampaignMemberRole)
  role: CampaignMemberRole;
}
