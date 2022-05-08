import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CharactersService } from './characters.service';

@ApiTags('characters')
@Controller()
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}
}
