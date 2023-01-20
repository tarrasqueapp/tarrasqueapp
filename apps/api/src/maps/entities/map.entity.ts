import { ValidateNested } from 'class-validator';

import { CampaignBaseEntity } from '../../campaigns/entities/campaign-base.entity';
import { TokenBaseEntity } from '../../tokens/entities/token-base.entity';
import { MapBaseEntity } from './map-base.entity';

export class MapEntity extends MapBaseEntity {
  // Tokens
  @ValidateNested({ each: true })
  tokens: TokenBaseEntity[];

  // Campaign
  @ValidateNested()
  campaign: CampaignBaseEntity;
}
