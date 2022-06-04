import { IsNumber, IsString } from 'class-validator';

export class FileDto {
  @IsString()
  name: string;
  @IsString()
  type: string;
  @IsString()
  extension: string;
  @IsNumber()
  size: number;
  @IsNumber()
  width: number;
  @IsNumber()
  height: number;
}
