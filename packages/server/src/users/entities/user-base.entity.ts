import { User } from '@prisma/client';
import { IsDateString, IsEmail, IsString } from 'class-validator';

export class UserBaseEntity implements Omit<User, 'password'> {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  // Avatar
  @IsString()
  avatarId: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
