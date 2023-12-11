import { SupabaseClient, User } from '@supabase/supabase-js';
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

import { getUser } from '@/actions/auth';
import { getUserCampaigns } from '@/actions/campaigns';
import { getInvites } from '@/actions/invites';
import { getMap, getMaps } from '@/actions/maps';
import { getMemberships } from '@/actions/memberships';
import { getProfile } from '@/actions/profiles';
import { getSetup } from '@/actions/setup';

import { createServerClient } from './supabase/server';
import { Database } from './supabase/types.gen';

export class SSRUtils {
  queryClient: QueryClient;
  cookieStore: ReadonlyRequestCookies;
  supabase: SupabaseClient<Database>;

  constructor() {
    this.queryClient = new QueryClient();
    this.cookieStore = cookies();
    this.supabase = createServerClient(this.cookieStore);
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
      queryFn: () => getUser(),
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
      queryFn: () => getProfile(),
    });
    type Data = Awaited<ReturnType<typeof getProfile>>;
    return this.queryClient.getQueryData<Data>(['profile']) || null;
  }

  /**
   * Prefetch the application setup
   * @returns The setup data
   */
  async prefetchSetup() {
    await this.queryClient.prefetchQuery({
      queryKey: ['setup'],
      queryFn: () => getSetup(),
    });
    type Data = Awaited<ReturnType<typeof getSetup>>;
    return this.queryClient.getQueryData<Data>(['setup']) || null;
  }

  /**
   * Prefetch the user's campaigns
   * @returns The user's campaigns
   */
  async prefetchUserCampaigns() {
    await this.queryClient.prefetchQuery({
      queryKey: ['campaigns', {}],
      queryFn: () => getUserCampaigns(),
    });
    type Data = Awaited<ReturnType<typeof getUserCampaigns>>;
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
      queryFn: () => getMaps(campaignId),
    });
    type Data = Awaited<ReturnType<typeof getMaps>>;
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
      queryFn: () => getMemberships(campaignId),
    });
    type Data = Awaited<ReturnType<typeof getMemberships>>;
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
      queryFn: () => getInvites(campaignId),
    });
    type Data = Awaited<ReturnType<typeof getInvites>>;
    return this.queryClient.getQueryData<Data>(['campaigns', campaignId, 'invites']) || [];
  }

  /**
   * Prefetch a map's data
   * @returns The map
   */
  async prefetchMap(id: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ['maps', id],
      queryFn: () => getMap(id),
    });
    type Data = Awaited<ReturnType<typeof getMap>>;
    return this.queryClient.getQueryData<Data>(['maps', id]) || null;
  }
}
