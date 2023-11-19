import { IsEnum, IsObject, IsString } from 'class-validator';

import { NotificationTypeEnum } from '../notification-type.enum';

export class NotificationEntity {
  @IsString()
  userId: string;

  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;

  @IsObject()
  data: object;
}
