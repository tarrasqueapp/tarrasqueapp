import { User } from '@prisma/client';

export class UserEntity implements Omit<User, 'password'> {
  id: string;
  name: string;
  email: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
}
