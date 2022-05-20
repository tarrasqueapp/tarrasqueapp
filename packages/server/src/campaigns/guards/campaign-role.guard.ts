import { CanActivate, ExecutionContext, Inject, Type, mixin } from '@nestjs/common';

import { CampaignsService } from '../campaigns.service';

export enum CampaignRole {
  OWNER = 'owner',
  PLAYER = 'player',
}

export const CampaignRoleGuard = (campaignRole: CampaignRole): Type<CanActivate> => {
  class CampaignRoleGuardMixin implements CanActivate {
    constructor(@Inject(CampaignsService) private readonly campaignsService: CampaignsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const campaignId = request.params.campaignId || request.body.campaignId;
      const user = request.user;

      if (!user || !campaignId) return false;

      const campaign = await this.campaignsService.getCampaign(campaignId);
      if (!campaign) return false;

      const isOwner = campaign.createdById === user.id;
      const isPlayer = campaign.players.some((player) => player.id === user.id);

      switch (campaignRole) {
        case CampaignRole.OWNER:
          return isOwner;
        case CampaignRole.PLAYER:
          return isPlayer || isOwner;
        default:
          return false;
      }
    }
  }

  return mixin(CampaignRoleGuardMixin);
};
