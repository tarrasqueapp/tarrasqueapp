import { IsString } from 'class-validator';

export class ConnectUserDto {
  @IsString()
  id: string;
}
