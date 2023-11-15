import { IsEmail, IsString } from 'class-validator';

export class SendTransactionalEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;
}
