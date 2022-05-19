import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { UserEntity } from '../../users/entities/user.entity';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  players?: UserEntity[];
}
