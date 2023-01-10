import { IsEmail, IsString } from 'class-validator';

export class SendResetPasswordEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  to: string;

  @IsString()
  token: string;
}
