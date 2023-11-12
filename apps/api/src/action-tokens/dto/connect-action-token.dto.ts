import { IsString } from 'class-validator';

export class ConnectActionTokenDto {
  @IsString()
  actionTokenId: string;
}
