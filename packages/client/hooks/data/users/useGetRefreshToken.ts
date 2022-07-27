import { useQuery } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { config } from '../../../lib/config';
import { UserInterface } from '../../../lib/types';
import { DateTimeUtils } from '../../../utils/DateTimeUtils';

/**
 * Send a request to get the updated refresh token
 * @returns Setup progress
 */
async function getRefreshToken() {
  const { data } = await api.get<UserInterface>(`/api/auth/refresh`);
  return data;
}

/**
 * Get the updated refresh token
 * @returns Setup query
 */
export function useGetRefreshToken() {
  // Get a new refresh token if the user is logged in
  const refetchInterval = DateTimeUtils.toMillisecondsFromString(config.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '5m');

  return useQuery([`auth/refresh`], () => getRefreshToken(), {
    refetchInterval,
  });
}
