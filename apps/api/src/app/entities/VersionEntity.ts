import { IsString } from 'class-validator';

export class VersionEntity {
  @IsString()
  version: string;
}
