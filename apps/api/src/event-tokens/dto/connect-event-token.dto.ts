import { IsString } from 'class-validator';

export class ConnectEventTokenDto {
  @IsString()
  eventTokenId: string;
}
