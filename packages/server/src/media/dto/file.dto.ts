import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FileDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  extension: string;

  @IsNumber()
  size: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}
