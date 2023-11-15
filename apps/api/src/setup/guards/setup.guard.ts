import { CanActivate, Injectable } from '@nestjs/common';

import { SetupService } from '../setup.service';

@Injectable()
export class SetupGuard implements CanActivate {
  constructor(private setupService: SetupService) {}

  /**
   * Only allow access to the setup route if the setup is not completed
   * @returns Whether the setup is not completed
   */
  async canActivate(): Promise<boolean> {
    try {
      const setup = await this.setupService.getSetup();
      return !setup.completed;
    } catch (error) {
      return true;
    }
  }
}
