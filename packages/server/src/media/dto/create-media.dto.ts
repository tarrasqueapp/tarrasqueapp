import { IsNumber, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  size: number;

  @IsString()
  format: string;
}
