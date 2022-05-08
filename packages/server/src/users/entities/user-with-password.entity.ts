import { User } from '@prisma/client';

export class UserWithPasswordEntity implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
}
