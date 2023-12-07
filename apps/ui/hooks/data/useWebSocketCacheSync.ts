import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {
  ActionTokenEntity,
  CampaignEntity,
  MapEntity,
  MembershipEntity,
  NotificationEntity,
  SocketEvent,
  UserEntity,
} from '@tarrasque/common';

import { socket } from '../../lib/socket';

export function useWebSocketCacheSync() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!queryClient) return;

    // Connect to the Tarrasque server
    socket.connect();

    let reconnectInterval: number | undefined;

    socket.on('connect', () => {
      // Clear the reconnect interval if it exists
      if (reconnectInterval) {
        clearTimeout(reconnectInterval);
      }
    });

    socket.on('disconnect', () => {
      // Try to reconnect to the Tarrasque server every 5 seconds
      reconnectInterval = window.setInterval(() => socket.connect(), 5000);
    });

    socket.on(SocketEvent.USER_UPDATED, handleUserUpdated);
    socket.on(SocketEvent.USER_DELETED, handleUserDeleted);

    socket.on(SocketEvent.CAMPAIGN_CREATED, handleCampaignCreated);
    socket.on(SocketEvent.CAMPAIGN_UPDATED, handleCampaignUpdated);
    socket.on(SocketEvent.CAMPAIGN_DELETED, handleCampaignDeleted);
    socket.on(SocketEvent.CAMPAIGNS_REORDERED, handleCampaignsReordered);

    socket.on(SocketEvent.INVITE_CREATED, handleInviteCreated);
    socket.on(SocketEvent.INVITE_UPDATED, handleInviteUpdated);
    socket.on(SocketEvent.INVITE_DELETED, handleInviteDeleted);

    socket.on(SocketEvent.MEMBERSHIP_CREATED, handleMembershipCreated);
    socket.on(SocketEvent.MEMBERSHIP_UPDATED, handleMembershipUpdated);
    socket.on(SocketEvent.MEMBERSHIP_DELETED, handleMembershipDeleted);

    socket.on(SocketEvent.NOTIFICATION_CREATED, handleNotificationCreated);
    socket.on(SocketEvent.NOTIFICATION_UPDATED, handleNotificationUpdated);
    socket.on(SocketEvent.NOTIFICATION_DELETED, handleNotificationDeleted);

    socket.on(SocketEvent.MAP_CREATED, handleMapCreated);
    socket.on(SocketEvent.MAP_UPDATED, handleMapUpdated);
    socket.on(SocketEvent.MAP_DELETED, handleMapDeleted);
    socket.on(SocketEvent.MAPS_REORDERED, handleMapsReordered);

    return () => {
      socket.off(SocketEvent.USER_UPDATED, handleUserUpdated);
      socket.off(SocketEvent.USER_DELETED, handleUserDeleted);

      socket.off(SocketEvent.CAMPAIGN_CREATED, handleCampaignCreated);
      socket.off(SocketEvent.CAMPAIGN_UPDATED, handleCampaignUpdated);
      socket.off(SocketEvent.CAMPAIGN_DELETED, handleCampaignDeleted);
      socket.on(SocketEvent.CAMPAIGNS_REORDERED, handleCampaignsReordered);

      socket.off(SocketEvent.INVITE_CREATED, handleInviteCreated);
      socket.off(SocketEvent.INVITE_UPDATED, handleInviteUpdated);
      socket.off(SocketEvent.INVITE_DELETED, handleInviteDeleted);

      socket.off(SocketEvent.MEMBERSHIP_CREATED, handleMembershipCreated);
      socket.off(SocketEvent.MEMBERSHIP_UPDATED, handleMembershipUpdated);
      socket.off(SocketEvent.MEMBERSHIP_DELETED, handleMembershipDeleted);

      socket.off(SocketEvent.NOTIFICATION_CREATED, handleNotificationCreated);
      socket.off(SocketEvent.NOTIFICATION_UPDATED, handleNotificationUpdated);
      socket.off(SocketEvent.NOTIFICATION_DELETED, handleNotificationDeleted);

      socket.off(SocketEvent.MAP_CREATED, handleMapCreated);
      socket.off(SocketEvent.MAP_UPDATED, handleMapUpdated);
      socket.off(SocketEvent.MAP_DELETED, handleMapDeleted);
      socket.off(SocketEvent.MAPS_REORDERED, handleMapsReordered);
    };
  }, [queryClient]);

  /**
   * Update the user in the cache when they are updated in the database
   * @param user - The updated user
   */
  function handleUserUpdated(user: UserEntity) {
    queryClient.setQueryData<UserEntity>(['user'], user);
  }

  /**
   * Remove the user from the cache when they are deleted from the database
   * @param user - The deleted user
   */
  function handleUserDeleted() {
    queryClient.setQueryData<UserEntity | null>(['user'], null);
    router.refresh();
  }

  /**
   * Add the campaign to the cache when it is created in the database
   * @param campaign - The created campaign
   */
  function handleCampaignCreated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Update the campaign in the cache when it is updated in the database
   * @param campaign - The updated campaign
   */
  function handleCampaignUpdated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Remove the campaign from the cache when it is deleted from the database
   * @param campaign - The deleted campaign
   */
  function handleCampaignDeleted(campaign: CampaignEntity) {
    queryClient.setQueryData(['campaigns', campaign.id], null);
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns: CampaignEntity[] | undefined) => {
      if (!campaigns) return;
      return campaigns.filter((b) => b.id !== campaign.id);
    });
  }

  /**
   * Reorder the campaigns in the cache when they are reordered in the database
   * @param campaignIds - The reordered campaign ids
   */
  function handleCampaignsReordered(campaignIds: string[]) {
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns: CampaignEntity[] | undefined) => {
      if (!campaigns) return;
      return campaignIds.map((id) => campaigns.find((c) => c.id === id)!);
    });
  }

  /**
   * Add the invite to the cache when it is created in the database
   * @param invite - The created invite
   */
  function handleInviteCreated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Update the invite in the cache when it is updated in the database
   * @param invite - The updated invite
   */
  function handleInviteUpdated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Remove the invite from the cache when it is deleted from the database
   * @param invite - The deleted invite
   */
  function handleInviteDeleted(invite: ActionTokenEntity) {
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns) => {
      if (!campaigns) return;
      return campaigns.map((c) => {
        if (c.id !== invite.campaignId) return c;
        return {
          ...c,
          invites: c.invites.filter((i) => i.id !== invite.id),
        };
      });
    });
  }

  /**
   * Add the membership to the cache when it is created in the database
   * @param membership - The created membership
   */
  function handleMembershipCreated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Update the membership in the cache when it is updated in the database
   * @param membership - The updated membership
   */
  function handleMembershipUpdated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Remove the membership from the cache when it is deleted from the database
   * @param membership - The deleted membership
   */
  function handleMembershipDeleted(membership: MembershipEntity) {
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns) => {
      if (!campaigns) return;
      return campaigns.map((c) => {
        if (c.id !== membership.campaignId) return c;
        return {
          ...c,
          memberships: c.memberships.filter((m) => m.userId !== membership.userId),
        };
      });
    });
    queryClient.setQueryData<MembershipEntity[]>(['campaigns', membership.campaignId, 'memberships'], (memberships) => {
      if (!memberships) return;
      return memberships.filter((m) => m.userId !== membership.userId);
    });

    // Remove the campaign from the cache if the user is the current user
    const user = queryClient.getQueryData<UserEntity>(['user']);
    if (user?.id === membership.userId) {
      queryClient.setQueryData<MembershipEntity[]>(['campaigns', membership.campaignId], undefined);
      queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns) => {
        if (!campaigns) return;
        return campaigns.filter((c) => c.id !== membership.campaignId);
      });
    }
  }

  /**
   * Add the notification to the cache when it is created in the database
   * @param notification - The created notification
   */
  function handleNotificationCreated(notification: NotificationEntity) {
    queryClient.setQueryData<NotificationEntity[]>(
      ['notifications'],
      (notifications: NotificationEntity[] | undefined) => {
        if (!notifications) return;
        return [notification, ...notifications];
      },
    );
  }

  /**
   * Update the notification in the cache when it is updated in the database
   * @param notification - The updated notification
   */
  function handleNotificationUpdated(notification: NotificationEntity) {
    queryClient.setQueryData<NotificationEntity[]>(
      ['notifications'],
      (notifications: NotificationEntity[] | undefined) => {
        if (!notifications) return;
        return notifications.map((b) => (b.data.id === notification.data.id ? notification : b));
      },
    );
  }

  /**
   * Remove the notification from the cache when it is deleted from the database
   * @param notification - The deleted notification
   */
  function handleNotificationDeleted(notification: NotificationEntity) {
    queryClient.setQueryData<NotificationEntity[]>(
      ['notifications'],
      (notifications: NotificationEntity[] | undefined) => {
        if (!notifications) return;
        return notifications.filter((b) => b.data.id !== notification.data.id);
      },
    );
  }

  /**
   * Add the map to the cache when it is created in the database
   * @param map - The created map
   */
  function handleMapCreated() {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  }

  /**
   * Update the map in the cache when it is updated in the database
   * @param map - The updated map
   */
  function handleMapUpdated(map: MapEntity) {
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns) => {
      if (!campaigns) return;
      return campaigns.map((c) => {
        if (c.id !== map.campaignId) return c;
        return {
          ...c,
          maps: c.maps.map((m) => (m.id === map.id ? map : m)),
        };
      });
    });
  }

  /**
   * Remove the map from the cache when it is deleted from the database
   * @param map - The deleted map
   */
  function handleMapDeleted(map: MapEntity) {
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns) => {
      if (!campaigns) return;
      return campaigns.map((c) => {
        if (c.id !== map.campaignId) return c;
        return {
          ...c,
          maps: c.maps.filter((m) => m.id !== map.id),
        };
      });
    });
  }

  /**
   * Reorder the maps in the cache when they are reordered in the database
   * @param mapIds - The reordered map ids
   */
  function handleMapsReordered({ campaignId, mapIds }: { campaignId: string; mapIds: string[] }) {
    queryClient.setQueryData<CampaignEntity[]>(['campaigns'], (campaigns) => {
      if (!campaigns) return;
      return campaigns.map((c) => {
        if (c.id !== campaignId) return c;
        return {
          ...c,
          maps: mapIds.map((id) => c.maps.find((m) => m.id === id)!),
        };
      });
    });
  }
}
