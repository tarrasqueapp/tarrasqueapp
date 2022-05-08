import { Token } from '@prisma/client';

export class TokenBaseEntity implements Token {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
  // Created by
  createdById: string;
  // Map
  mapId: string;
  // Player Character
  playerCharacterId: string | null;
  // Non Player Character
  nonPlayerCharacterId: string | null;
}
