import { IsEmail, IsString } from 'class-validator';

export class SendPasswordResetEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  to: string;

  @IsString()
  token: string;
}
