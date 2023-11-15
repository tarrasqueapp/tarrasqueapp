import { Membership, Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateMembershipDto implements Partial<Membership> {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
