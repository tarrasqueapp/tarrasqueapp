import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateInviteDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
