import { Membership, Role } from '@prisma/client';
import { IsEnum, IsHexColor, IsOptional } from 'class-validator';

export class UpdateMembershipDto implements Partial<Membership> {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
