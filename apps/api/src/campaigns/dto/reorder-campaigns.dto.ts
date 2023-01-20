import { IsString } from 'class-validator';

export class ReorderCampaignsDto {
  @IsString({ each: true })
  campaignIds: string[];
}
