import { IsString } from 'class-validator';

export class ReordersCampaignsDto {
  @IsString({ each: true })
  campaignIds: string[];
}
