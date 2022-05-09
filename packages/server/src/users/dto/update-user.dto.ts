import { Role } from '@prisma/client';

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  refreshToken?: string;
}
