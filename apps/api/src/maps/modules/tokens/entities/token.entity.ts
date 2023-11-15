import { Token } from '@prisma/client';
import { IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CharacterEntity } from '../../../../characters/entities/character.entity';
import { UserEntity } from '../../../../users/entities/user.entity';

export class TokenEntity implements Token {
  @IsString()
  id: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

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

  // Map
  @IsString()
  mapId: string;

  // Character
  @IsOptional()
  @ValidateNested()
  character?: CharacterEntity;

  @IsString()
  characterId: string | null;
}
