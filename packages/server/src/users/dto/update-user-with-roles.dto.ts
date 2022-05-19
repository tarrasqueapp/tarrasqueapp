import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

import { UpdateUserDto } from './update-user.dto';

export class UpdateUserWithRolesDto extends UpdateUserDto {
  @IsOptional()
  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role, isArray: true })
  roles?: Role[];
}
