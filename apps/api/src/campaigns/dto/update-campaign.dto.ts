import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { CampaignMemberEntity } from '../entities/campaign-member.entity';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  members?: CampaignMemberEntity[];
}
