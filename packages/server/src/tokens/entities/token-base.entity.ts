import { Token } from '@prisma/client';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class TokenBaseEntity implements Token {
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
  @IsString()
  createdById: string;

  // Map
  @IsString()
  mapId: string;

  // Player Character
  @IsString()
  playerCharacterId: string | null;

  // Non Player Character
  @IsString()
  nonPlayerCharacterId: string | null;
}
