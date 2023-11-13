import { User } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class SignUpDto implements Partial<User> {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  token: string;
}
