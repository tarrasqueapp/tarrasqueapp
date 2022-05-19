import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsJWT, IsString } from 'class-validator';

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

  @IsJWT()
  refreshToken: string;

  // DateTime
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}
