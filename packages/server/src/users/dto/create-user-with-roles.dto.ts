import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class CreateUserWithRolesDto extends CreateUserDto {
  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];
}
