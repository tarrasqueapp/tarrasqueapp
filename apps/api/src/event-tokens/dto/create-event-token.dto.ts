import { EventToken, EventTokenType, Prisma } from '@prisma/client';
import { IsDateString, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateEventTokenDto implements Partial<EventToken> {
  @IsEnum(EventTokenType)
  type: EventTokenType;

  @IsString()
  email: string;

  @IsOptional()
  @IsJSON()
  payload?: Prisma.JsonValue;

  @IsDateString()
  expiresAt: Date;

  @IsOptional()
  @IsString()
  userId?: string | null;

  @IsOptional()
  @IsString()
  campaignId?: string | null;
}
