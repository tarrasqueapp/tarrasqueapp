import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsString } from 'class-validator';

export class UserBaseEntity implements Omit<User, 'password'> {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  // Avatar
  @IsString()
  avatarId: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
