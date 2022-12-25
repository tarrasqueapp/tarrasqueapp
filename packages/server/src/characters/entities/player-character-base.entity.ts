import { PlayerCharacter } from '@prisma/client';
import { IsDateString, IsString, ValidateNested } from 'class-validator';

import { MediaEntity } from '../../media/entities/media.entity';
import { UserBaseEntity } from '../../users/entities/user-base.entity';

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
  @ValidateNested({ each: true })
  media: MediaEntity[];

  @IsString()
  selectedMediaId: string;

  // Created by
  @IsString()
  createdById: string;

  // Controlled by
  @ValidateNested({ each: true })
  controlledBy: UserBaseEntity[];

  // Campaign
  @IsString()
  campaignId: string;
}
