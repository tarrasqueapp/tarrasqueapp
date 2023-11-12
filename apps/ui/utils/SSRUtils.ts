import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';

import { getUser } from '../hooks/data/auth/useGetUser';
import { getSetup } from '../hooks/data/setup/useGetSetup';
import { SetupEntity, UserEntity } from '../lib/types';

export class SSRUtils {
  queryClient: QueryClient;
  context: GetServerSidePropsContext;
  headers: { cookie: string };

  constructor(context: GetServerSidePropsContext) {
    this.queryClient = new QueryClient();
    this.context = context;
    this.headers = { cookie: this.context.req.headers.cookie || '' };
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
  async getUser() {
    await this.queryClient.prefetchQuery({
      queryKey: ['auth'],
      queryFn: () => getUser({ withCredentials: true, headers: this.headers }) || null,
    });
    return this.queryClient.getQueryData<UserEntity>(['auth']) || null;
  }

  /**
   * Prefetch the application setup
   * @returns The setup data
   */
  async getSetup() {
    await this.queryClient.prefetchQuery({
      queryKey: ['setup'],
      queryFn: () => getSetup({ withCredentials: true, headers: this.headers }) || null,
    });
    return this.queryClient.getQueryData<SetupEntity>(['setup']) || null;
  }
}
