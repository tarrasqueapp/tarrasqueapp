import { IsString } from 'class-validator';

export class UninstallPluginDto {
  @IsString()
  pluginId: string;
}
