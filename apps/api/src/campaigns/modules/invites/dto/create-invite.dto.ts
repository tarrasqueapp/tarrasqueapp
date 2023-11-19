import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
