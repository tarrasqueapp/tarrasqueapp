import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsString } from 'class-validator';

export class UserEntity implements Omit<User, 'password' | 'refreshToken'> {
  @IsString()
  id: string;
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  // DateTime
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}
