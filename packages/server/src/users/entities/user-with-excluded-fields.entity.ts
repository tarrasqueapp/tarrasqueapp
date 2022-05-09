import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum, IsJWT } from 'class-validator';

export class UserWithExcludedFieldsEntity implements User {
  id: string;
  name: string;

  @IsEmail()
  email: string;

  password: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  @IsJWT()
  refreshToken: string;

  // DateTime
  createdAt: Date;
  updatedAt: Date;
}
