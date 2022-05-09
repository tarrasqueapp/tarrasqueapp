import { Role, User } from '@prisma/client';

export class UserEntity implements Omit<User, 'password' | 'refreshToken'> {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  // DateTime
  createdAt: Date;
  updatedAt: Date;
}
