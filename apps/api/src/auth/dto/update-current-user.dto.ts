import { User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCurrentUserDto implements Partial<User> {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatarId?: string;
}
