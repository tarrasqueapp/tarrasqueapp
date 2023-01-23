import { Module } from '@nestjs/common';

import { CharactersService } from './characters.service';

@Module({
  providers: [CharactersService],
})
export class CharactersModule {}
