import { IsString } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  userId: string;
}
