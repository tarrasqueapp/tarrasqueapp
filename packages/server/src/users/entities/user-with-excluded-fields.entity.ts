import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsString, ValidateNested } from 'class-validator';

import { RefreshTokenEntity } from './refresh-token-entity';

export class UserWithExcludedFieldsEntity implements User {
  @IsString()
  id: string;
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  @ValidateNested({ each: true })
  refreshTokens: RefreshTokenEntity[];

  // DateTime
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}
