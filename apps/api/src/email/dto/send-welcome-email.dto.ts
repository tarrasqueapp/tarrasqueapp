import { IsEmail, IsString } from 'class-validator';

export class SendWelcomeEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  to: string;
}
