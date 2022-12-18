import { Module } from '@nestjs/common';

import { StorageService } from '../storage/storage.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, StorageService],
})
export class MediaModule {}
