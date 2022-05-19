import { IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;
}
