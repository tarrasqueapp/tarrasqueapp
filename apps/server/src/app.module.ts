import { Module } from '@nestjs/common';

import { MapModule } from './map/map.module';
import { PointerModule } from './pointer/pointer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MapModule, PointerModule, UserModule],
})
export class AppModule {}
