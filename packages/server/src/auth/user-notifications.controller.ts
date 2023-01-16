import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CampaignInvitesService } from '../campaigns/campaign-invites.service';
import { CampaignInviteEntity } from '../campaigns/entities/campaign-invite.entity';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth/notifications')
@Controller('auth/notifications')
export class UserNotificationsController {
  constructor(private readonly campaignInvitesService: CampaignInvitesService) {}

  /**
   * Get the user's notifications
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async getNotifications(@User() user: UserEntity): Promise<{ campaignInvites: CampaignInviteEntity[] }> {
    const campaignInvites = await this.campaignInvitesService.getInvitesByUserId(user.id);
    return { campaignInvites };
  }
}
