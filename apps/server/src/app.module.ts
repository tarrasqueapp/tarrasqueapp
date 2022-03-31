import { Module } from '@nestjs/common';

import { MapsModule } from './maps/maps.module';
import { PointerModule } from './pointer/pointer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MapsModule, PointerModule, UserModule],
})
export class AppModule {}
