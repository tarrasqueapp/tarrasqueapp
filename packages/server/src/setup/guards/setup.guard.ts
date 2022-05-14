import { CanActivate, Injectable } from '@nestjs/common';

import { UsersService } from '../../users/users.service';

@Injectable()
export class SetupGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Only allow access to the setup route if there are no users in the database
   */
  async canActivate(): Promise<boolean> {
    try {
      const userCount = await this.usersService.getUserCount();
      return userCount === 0;
    } catch (error) {
      return true;
    }
  }
}
