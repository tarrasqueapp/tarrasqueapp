import { IsString } from 'class-validator';

export class ConnectUserDto {
  @IsString()
  userId: string;
}
