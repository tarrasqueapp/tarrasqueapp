import { EventTokenType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class EventTokenTypeDto {
  @IsEnum(EventTokenType)
  type: EventTokenType;
}
