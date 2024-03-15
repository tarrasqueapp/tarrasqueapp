import { SupabaseClient, User } from '@supabase/supabase-js';
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';

import { getUser } from '@/actions/auth';
import { getCampaign, getUserCampaigns } from '@/actions/campaigns';
import { getInvite, getInvites } from '@/actions/invites';
import { getMap, getMaps } from '@/actions/maps';
import { getMemberships } from '@/actions/memberships';
import { getProfile } from '@/actions/profiles';
import { getSetup } from '@/actions/setup';

import { createServerClient } from './supabase/server';
import { Database } from './supabase/types.gen';

export class SSRUtils {
  queryClient: QueryClient;
  supabase: SupabaseClient<Database>;

  constructor() {
    this.queryClient = new QueryClient();
    this.supabase = createServerClient();
  }

  /**
   * Dehydrate the query client
   * @returns The dehydrated state of the query client
   */
  dehydrate(): DehydratedState {
    return dehydrate(this.queryClient);
  }

  /**
   * Prefetch the user
   * @returns The user object
   */
  async prefetchUser() {
    await this.queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await getUser();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    return this.queryClient.getQueryData<User>(['user']) || null;
  }

  /**
   * Prefetch the user profile
   * @returns The user profile
   */
  async prefetchProfile() {
    await this.queryClient.prefetchQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const response = await getProfile();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getProfile>>['data'];
    return this.queryClient.getQueryData<Data>(['profile']) || null;
  }

  /**
   * Prefetch the application setup
   * @returns The setup data
   */
  async prefetchSetup() {
    await this.queryClient.prefetchQuery({
      queryKey: ['setup'],
      queryFn: async () => {
        const response = await getSetup();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getSetup>>['data'];
    return this.queryClient.getQueryData<Data>(['setup']) || null;
  }

  /**
   * Prefetch the user's campaigns
   * @returns The user's campaigns
   */
  async prefetchUserCampaigns() {
    await this.queryClient.prefetchQuery({
      queryKey: ['campaigns', {}],
      queryFn: async () => {
        const response = await getUserCampaigns();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getUserCampaigns>>['data'];
    return this.queryClient.getQueryData<Data>(['campaigns', {}]) || [];
  }

  /**
   * Prefetch a campaign's maps
   * @param campaignId - The ID of the campaign to prefetch maps for
   * @returns The maps
   */
  async prefetchCampaignMaps(campaignId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['campaigns', campaignId, 'maps'],
      queryFn: async () => {
        const response = await getMaps(campaignId);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getMaps>>['data'];
    return this.queryClient.getQueryData<Data>(['campaigns', campaignId, 'maps']) || [];
  }

  /**
   * Prefetch a campaign's memberships
   * @param campaignId - The ID of the campaign to prefetch memberships for
   * @returns The memberships
   */
  async prefetchCampaignMemberships(campaignId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['campaigns', campaignId, 'memberships'],
      queryFn: async () => {
        const response = await getMemberships(campaignId);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getMemberships>>['data'];
    return this.queryClient.getQueryData<Data>(['campaigns', campaignId, 'memberships']) || [];
  }

  /**
   * Prefetch a campaign's invites
   * @param campaignId - The ID of the campaign to prefetch invites for
   * @returns The invites
   */
  async prefetchCampaignInvites(campaignId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['campaigns', campaignId, 'invites'],
      queryFn: async () => {
        const response = await getInvites(campaignId);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getInvites>>['data'];
    return this.queryClient.getQueryData<Data>(['campaigns', campaignId, 'invites']) || [];
  }

  /**
   * Prefetch an invite
   * @param inviteId - The ID of the invite to prefetch
   * @returns The invite
   */
  async prefetchInvite(inviteId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['invites', inviteId],
      queryFn: async () => {
        const response = await getInvite(inviteId);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getInvite>>['data'];
    return this.queryClient.getQueryData<Data>(['invites', inviteId]) || null;
  }

  /**
   * Prefetch a map's data
   * @returns The map
   */
  async prefetchMap(id: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['maps', id],
      queryFn: async () => {
        const response = await getMap(id);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getMap>>['data'];
    return this.queryClient.getQueryData<Data>(['maps', id]) || null;
  }

  /**
   * Prefetch a campaign's data
   * @returns The campaign
   */
  async prefetchCampaign(id: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['campaigns', id],
      queryFn: async () => {
        const response = await getCampaign(id);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
    type Data = Awaited<ReturnType<typeof getCampaign>>['data'];
    return this.queryClient.getQueryData<Data>(['campaigns', id]) || null;
  }
}
