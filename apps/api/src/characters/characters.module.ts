import { Module } from '@nestjs/common';

import { CharactersService } from './characters.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CharactersService],
  exports: [],
})
export class CharactersModule {}
