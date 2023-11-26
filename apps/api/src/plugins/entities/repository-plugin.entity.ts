import { IsString } from 'class-validator';

export class RepositoryPluginEntity {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  keywords: string[];

  @IsString()
  iconUrl: string;

  @IsString()
  manifestUrl: string;
}
