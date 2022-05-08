import { Campaign } from '@prisma/client';

export class CampaignBaseEntity implements Campaign {
  id: string;
  name: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
  // Created by
  createdById: string;
}
