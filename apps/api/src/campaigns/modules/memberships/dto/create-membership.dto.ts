import { Membership, Role } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateMembershipDto implements Partial<Membership> {
  @IsString()
  userId: string;

  @IsString()
  campaignId: string;

  @IsString()
  role: Role;
}
