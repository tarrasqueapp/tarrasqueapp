import { Module } from '@nestjs/common';

import { PointerGateway } from './pointer.gateway';

@Module({
  providers: [PointerGateway],
})
export class PointerModule {}
