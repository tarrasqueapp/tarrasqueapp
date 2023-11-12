import { ActionTokenType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ActionTokenTypeDto {
  @IsEnum(ActionTokenType)
  type: ActionTokenType;
}
