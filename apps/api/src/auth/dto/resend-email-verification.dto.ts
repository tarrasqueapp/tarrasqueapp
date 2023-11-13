import { IsString } from 'class-validator';

export class ResendEmailVerificationDto {
  @IsString()
  email: string;
}
