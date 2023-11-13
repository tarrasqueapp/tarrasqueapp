import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  email: string;
}
