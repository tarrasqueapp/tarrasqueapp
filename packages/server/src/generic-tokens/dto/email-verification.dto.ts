import { IsString } from 'class-validator';

export class EmailVerificationDto {
  @IsString()
  userId: string;
}
