import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';

import { getUser } from '../hooks/data/users/useGetUser';
import { UserEntity } from '../lib/types';

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
  dehydrate() {
    return dehydrate(this.queryClient);
  }

  /**
   * Get the user from the server side
   * @returns user
   */
  async getUser() {
    await this.queryClient.prefetchQuery(
      ['auth'],
      () => getUser({ withCredentials: true, headers: this.headers }) || null,
    );
    return this.queryClient.getQueryData<UserEntity>(['auth']) || null;
  }
}
