import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTokenDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;
}
