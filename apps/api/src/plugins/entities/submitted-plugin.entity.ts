import { IsString } from 'class-validator';

export class SubmittedPluginEntity {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  manifest_url: string;
}
