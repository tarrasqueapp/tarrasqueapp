import { IsString } from 'class-validator';

export class ReorderMapsDto {
  @IsString({ each: true })
  mapIds: string[];
}
