import { PlayerCharacter } from '@prisma/client';
import { IsDateString, IsString, ValidateNested } from 'class-validator';

import { MediaEntity } from '../../media/entities/media.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class PlayerCharacterBaseEntity implements PlayerCharacter {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  size: string;
  @IsString()
  alignment: string;
  // DateTime
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
  // Media
  @ValidateNested()
  media: MediaEntity;
  @IsString()
  mediaId: string | null;
  // Created by
  @IsString()
  createdById: string;
  // Controlled by
  @ValidateNested({ each: true })
  controlledBy: UserEntity[];
  // Campaign
  @IsString()
  campaignId: string;
}
