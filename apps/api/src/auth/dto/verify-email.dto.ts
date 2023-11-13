import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  token: string;
}
