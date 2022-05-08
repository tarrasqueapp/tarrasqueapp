import { Media } from '@prisma/client';

export class MediaEntity implements Media {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
  // Created by
  createdById: string;
}
