import { Map } from '@prisma/client';

import { MediaEntity } from '../../media/entities/media.entity';

export class MapBaseEntity implements Map {
  id: string;
  name: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
  // Media
  media: MediaEntity;
  mediaId: string | null;
  // Campaign
  campaignId: string;
  // Created by
  createdById: string;
}
