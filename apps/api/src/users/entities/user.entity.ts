import { ValidateNested } from 'class-validator';

import { MediaEntity } from '../../media/entities/media.entity';
import { UserBaseEntity } from './user-base.entity';

export class UserEntity extends UserBaseEntity {
  // Avatar
  @ValidateNested()
  avatar: MediaEntity;
}
