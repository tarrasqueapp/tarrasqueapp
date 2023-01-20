import { IsString } from 'class-validator';

export class ConnectMapDto {
  @IsString()
  mapId: string;
}
