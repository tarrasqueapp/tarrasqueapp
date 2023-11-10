import { User } from '@prisma/client';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

import { MediaEntity } from '../../media/entities/media.entity';

export class UserEntity implements User {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isEmailVerified: boolean;

  @IsOptional()
  @IsString()
  password: string;

  @IsBoolean()
  isAdmin: boolean;

  // Avatar
  @IsOptional()
  @ValidateNested()
  avatar?: MediaEntity;

  @IsString()
  avatarId: string | null;

  // Order of user campaigns
  @IsString({ each: true })
  campaignOrder: string[];

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
