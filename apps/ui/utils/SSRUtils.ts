import { SupabaseClient, User } from '@supabase/supabase-js';
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

import { Profile, getProfile, getUser } from '../app/auth/actions';
import { getSetup } from '../app/setup/actions';
import { createClient } from './supabase/server';
import { Database } from './supabase/types';

export class SSRUtils {
  queryClient: QueryClient;
  cookieStore: ReadonlyRequestCookies;
  supabase: SupabaseClient<Database>;

  constructor() {
    this.queryClient = new QueryClient();
    this.cookieStore = cookies();
    this.supabase = createClient(this.cookieStore);
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
      queryFn: getUser,
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
      queryFn: getProfile,
    });

    return this.queryClient.getQueryData<Profile>(['profile']) || null;
  }

  /**
   * Prefetch the application setup
   * @returns The setup data
   */
  async prefetchSetup() {
    await this.queryClient.prefetchQuery({
      queryKey: ['setup'],
      queryFn: getSetup,
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
      queryKey: ['campaigns'],
      queryFn: async () => {
        const { data } = await this.supabase.from('campaigns').select('*');
        return data;
      },
    });
    type CampaignEntity = Database['public']['Tables']['campaigns']['Row'];
    return this.queryClient.getQueryData<CampaignEntity[]>(['campaigns']) || [];
  }
}
