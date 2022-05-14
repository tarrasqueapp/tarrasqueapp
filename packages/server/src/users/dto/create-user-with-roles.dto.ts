import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateUserWithRolesDto {
  name: string;

  @IsEmail()
  email: string;

  password: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];
}
