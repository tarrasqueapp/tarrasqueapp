import { IsString } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  email: string;
}
