import { ValidateNested } from 'class-validator';

import { ActionTokenEntity } from '../../action-tokens/entities/action-token.entity';
import { NotificationTypeEnum } from '../notification-type.enum';
import { NotificationEntity } from './notification.entity';

export class InviteNotificationEntity extends NotificationEntity {
  type = NotificationTypeEnum.INVITE;

  @ValidateNested()
  data: ActionTokenEntity;
}
