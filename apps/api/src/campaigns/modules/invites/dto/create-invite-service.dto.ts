import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignEntity } from '../../../entities/campaign.entity';

export class CreateInviteServiceDto {
  @IsEmail()
  email: string;

  @ValidateNested()
  campaign: CampaignEntity;

  @IsOptional()
  @IsString()
  userId?: string;
}
