import { Role, User } from '@prisma/client';

export class UserWithExcludedFieldsEntity implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: Role[];
  refreshToken: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
}
