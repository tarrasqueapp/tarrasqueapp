import { IsString } from 'class-validator';

export class CreateMapDto {
  @IsString()
  name: string;

  @IsString()
  mediaId: string;

  @IsString()
  campaignId: string;
}
