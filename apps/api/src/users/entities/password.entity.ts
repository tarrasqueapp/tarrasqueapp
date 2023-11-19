import { Password } from '@prisma/client';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { UserEntity } from './user.entity';

export class PasswordEntity implements Password {
  @IsString()
  hash: string;

  // User
  @IsOptional()
  @ValidateNested()
  user?: UserEntity;

  @IsString()
  userId: string;
}
