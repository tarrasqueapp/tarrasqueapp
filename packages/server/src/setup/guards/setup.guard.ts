import { CanActivate, Injectable } from '@nestjs/common';

import { SetupService } from '../setup.service';

@Injectable()
export class SetupGuard implements CanActivate {
  constructor(private readonly setupService: SetupService) {}

  /**
   * Only allow access to the setup route if there are no users in the database
   */
  async canActivate(): Promise<boolean> {
    try {
      const setup = await this.setupService.getSetup();
      return !setup.database || !setup.user || !setup.campaign || !setup.map;
    } catch (error) {
      return true;
    }
  }
}
