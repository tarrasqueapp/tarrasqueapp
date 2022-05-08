import { UserEntity } from '../../users/entities/user.entity';

export class UpdateCampaignDto {
  name?: string;
  players?: UserEntity[];
}
