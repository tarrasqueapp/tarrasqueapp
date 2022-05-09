import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class UserEntity implements Omit<User, 'password' | 'refreshToken'> {
  id: string;
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  // DateTime
  createdAt: Date;
  updatedAt: Date;
}
