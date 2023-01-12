import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  userId: string;
}
