import { User } from '@prisma/client';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

import { MembershipEntity } from '../../campaigns/modules/memberships/entities/membership.entity';
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

  // Avatar
  @IsOptional()
  @ValidateNested()
  avatar: MediaEntity | null;

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

  // Memberships
  @IsOptional()
  @ValidateNested({ each: true })
  memberships?: MembershipEntity[];
}
