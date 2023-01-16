import { CanActivate, ExecutionContext, Inject, Logger, Type, mixin } from '@nestjs/common';
import { CampaignMemberRole } from '@prisma/client';

import { MapsService } from '../../maps/maps.service';
import { CampaignsService } from '../campaigns.service';

export const CampaignRoleGuard = (campaignRole: CampaignMemberRole): Type<CanActivate> => {
  class CampaignRoleGuardMixin implements CanActivate {
    private logger: Logger = new Logger(CampaignRoleGuardMixin.name);

    constructor(
      @Inject(CampaignsService) private readonly campaignsService: CampaignsService,
      @Inject(MapsService) private readonly mapsService: MapsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      let campaignId = request.params.campaignId || request.body.campaignId;
      const mapId = request.params.mapId || request.body.mapId;
      const user = request.user;

      if (!user || !campaignId) {
        if (mapId) {
          const map = await this.mapsService.getMap(mapId);
          if (!map) return false;
          campaignId = map.campaignId;
        }
      }

      const campaign = await this.campaignsService.getCampaign(campaignId);
      if (!campaign) return false;

      const isGameMaster =
        campaign.createdById === user.id ||
        campaign.members.some((member) => member.userId === user.id && member.role === CampaignMemberRole.GAME_MASTER);
      const isPlayer = campaign.members.some(
        (member) => member.userId === user.id && member.role === CampaignMemberRole.PLAYER,
      );

      switch (campaignRole) {
        case CampaignMemberRole.GAME_MASTER:
          return isGameMaster;
        case CampaignMemberRole.PLAYER:
          return isPlayer || isGameMaster;
        default:
          return false;
      }
    }
  }

  return mixin(CampaignRoleGuardMixin);
};
