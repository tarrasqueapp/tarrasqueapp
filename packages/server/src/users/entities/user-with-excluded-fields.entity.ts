import { User } from '@prisma/client';
import { IsDateString, IsEmail, IsString, ValidateNested } from 'class-validator';

import { RefreshTokenEntity } from './refresh-token-entity';

export class UserWithExcludedFieldsEntity implements User {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  avatarId: string;

  @ValidateNested({ each: true })
  refreshTokens: RefreshTokenEntity[];

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Order of user campaigns
  @IsString({ each: true })
  campaignOrder: string[];
}
