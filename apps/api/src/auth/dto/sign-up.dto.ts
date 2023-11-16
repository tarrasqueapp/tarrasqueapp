import { User } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignUpDto implements Partial<User> {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  token?: string;
}
