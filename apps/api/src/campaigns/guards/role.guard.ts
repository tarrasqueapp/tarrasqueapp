import { CanActivate, ExecutionContext, Inject, Type, mixin } from '@nestjs/common';
import { Role } from '@prisma/client';

import { MapsService } from '../../maps/maps.service';
import { UserEntity } from '../../users/entities/user.entity';
import { CampaignsService } from '../campaigns.service';

export const RoleGuard = (campaignRole: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @Inject(CampaignsService) private campaignsService: CampaignsService,
      @Inject(MapsService) private mapsService: MapsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      // Get the campaign, map, and user from the request
      let campaignId: string | undefined = request.params.campaignId || request.body.campaignId;
      const mapId: string | undefined = request.params.mapId || request.body.mapId;
      const user: UserEntity = request.user;

      // If the campaign id is not provided, get it from the map
      if (!user || !campaignId) {
        if (mapId) {
          const map = await this.mapsService.getMapById(mapId);
          if (!map) return false;
          campaignId = map.campaignId;
        }
      }

      // Check that the campaign exists
      const campaign = await this.campaignsService.getCampaignById(campaignId);
      if (!campaign) return false;

      // Check that the user is a member of the campaign
      const isGameMaster = campaign.memberships.some(
        (membership) => membership.userId === user.id && membership.role === Role.GAME_MASTER,
      );
      const isPlayer = campaign.memberships.some(
        (membership) => membership.userId === user.id && membership.role === Role.PLAYER,
      );

      // Check that the user has the required role
      switch (campaignRole) {
        case Role.GAME_MASTER:
          return isGameMaster;
        case Role.PLAYER:
          return isPlayer || isGameMaster;
        default:
          return false;
      }
    }
  }

  return mixin(RoleGuardMixin);
};
