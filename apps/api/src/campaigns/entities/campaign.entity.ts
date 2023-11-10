import { Campaign } from '@prisma/client';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CharacterEntity } from '../../characters/entities/character.entity';
import { EventTokenEntity } from '../../event-tokens/entities/event-token.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CampaignMemberEntity } from './campaign-member.entity';

export class CampaignEntity implements Campaign {
  @IsString()
  id: string;

  @IsString()
  name: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Created by
  @IsOptional()
  @ValidateNested()
  createdBy?: UserEntity;

  @IsString()
  createdById: string;

  // Members
  @IsOptional()
  @ValidateNested({ each: true })
  members?: CampaignMemberEntity[];

  // Characters
  @IsOptional()
  @ValidateNested({ each: true })
  characters?: CharacterEntity[];

  // Invites
  @IsOptional()
  @ValidateNested({ each: true })
  invites?: EventTokenEntity[];
}
