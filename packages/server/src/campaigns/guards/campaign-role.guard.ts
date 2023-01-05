import { CanActivate, ExecutionContext, Inject, Logger, Type, mixin } from '@nestjs/common';

import { MapsService } from '../../maps/maps.service';
import { CampaignsService } from '../campaigns.service';

export enum CampaignRole {
  OWNER = 'owner',
  PLAYER = 'player',
}

export const CampaignRoleGuard = (campaignRole: CampaignRole): Type<CanActivate> => {
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
