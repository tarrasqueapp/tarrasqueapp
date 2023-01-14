import { IsString } from 'class-validator';

export class InviteMemberDto {
  @IsString()
  email: string;
}
