import { Setup } from '@prisma/client';
import { IsBoolean, IsNumber } from 'class-validator';

import { SetupStep } from '../setup-step.enum';

export class SetupDto implements Setup {
  @IsNumber()
  id: number;

  @IsNumber()
  step: SetupStep;

  @IsBoolean()
  completed: boolean;
}
