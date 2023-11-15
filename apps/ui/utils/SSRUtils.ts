import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';

import { ActionTokenEntity, ActionTokenType, SetupEntity, UserEntity } from '@tarrasque/sdk';

import { getActionToken } from '../hooks/data/action-tokens/useGetActionToken';
import { getUser } from '../hooks/data/auth/useGetUser';
import { getSetup } from '../hooks/data/setup/useGetSetup';

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

  /**
   * Prefetch an action token
   * @param tokenId - token id
   * @param type - token type
   * @returns token
   */
  async getActionToken(tokenId: string, type?: ActionTokenType): Promise<ActionTokenEntity | null> {
    if (!tokenId) {
      return null;
    }

    await this.queryClient.prefetchQuery({
      queryKey: ['tokens', tokenId],
      queryFn: () => getActionToken(tokenId, type, { withCredentials: true, headers: this.headers }) || null,
    });
    return this.queryClient.getQueryData<ActionTokenEntity>(['tokens', tokenId]) || null;
  }
}
