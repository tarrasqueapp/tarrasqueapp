import { IsBoolean, ValidateNested } from 'class-validator';

import { CampaignBaseEntity } from '../../campaigns/entities/campaign-base.entity';
import { MapBaseEntity } from '../../maps/entities/map-base.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class SetupDto {
  @IsBoolean()
  database = false;

  @ValidateNested()
  user = null as UserEntity | null;

  @ValidateNested()
  campaign = null as CampaignBaseEntity | null;

  @ValidateNested()
  map = null as MapBaseEntity | null;

  @IsBoolean()
  completed = false;
}
