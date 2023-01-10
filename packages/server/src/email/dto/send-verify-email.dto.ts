import { IsEmail, IsString } from 'class-validator';

export class SendVerifyEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  to: string;

  @IsString()
  token: string;
}
