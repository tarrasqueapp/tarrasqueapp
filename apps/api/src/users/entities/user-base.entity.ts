import { User } from '@prisma/client';
import { IsBoolean, IsDateString, IsEmail, IsString } from 'class-validator';

export class UserBaseEntity implements Omit<User, 'password'> {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  emailVerified: boolean;

  // Avatar
  @IsString()
  avatarId: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Order of user campaigns
  @IsString({ each: true })
  campaignOrder: string[];
}
