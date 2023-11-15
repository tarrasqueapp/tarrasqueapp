import { Module } from '@nestjs/common';

import { MembershipsModule } from '../campaigns/modules/memberships/memberships.module';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  imports: [MembershipsModule],
  controllers: [],
  providers: [UsersService, UsersGateway],
  exports: [UsersService, UsersGateway],
})
export class UsersModule {}
