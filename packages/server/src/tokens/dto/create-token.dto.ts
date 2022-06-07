import { IsNumber, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsString()
  playerCharacterId: string | null;

  @IsString()
  nonPlayerCharacterId: string | null;
}
