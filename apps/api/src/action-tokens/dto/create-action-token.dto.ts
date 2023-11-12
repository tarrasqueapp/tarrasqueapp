import { ActionToken, ActionTokenType, Prisma } from '@prisma/client';
import { IsDateString, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateActionTokenDto implements Partial<ActionToken> {
  @IsEnum(ActionTokenType)
  type: ActionTokenType;

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
