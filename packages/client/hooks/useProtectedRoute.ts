import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { AppNavigation } from '../lib/navigation';
import { Role } from '../lib/types';
import { useGetRefreshToken } from './data/users/useGetRefreshToken';

/**
 * Protect routes from unauthorized access
 * @param role - The role required to access the route
 * @example
 * ```
 * useProtectedRoute(Role.ADMIN);
 * ```
 */
export function useProtectedRoute(role: Role) {
  const { data: user, error, isLoading } = useGetRefreshToken();

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Avoid looping redirects
    if (router.pathname !== AppNavigation.SignIn) {
      // Sign out the user if there is an authorization error
      if (error && error.status === 401) {
        router.push(AppNavigation.SignOut);
        return;
      }

      // Redirect to sign in page if the user is not signed in and the page is not public
      if (!user && !isLoading && role !== Role.GUEST) {
        router.push(AppNavigation.SignIn);
        return;
      }
    }

    // Don't allow lower role users to access higher role pages
    if (user && !user.roles.includes(role)) {
      router.push(AppNavigation.Dashboard);
      return;
    }

    // Redirect to dashboard if already signed in
    if (user && role === Role.GUEST) {
      const referrer = (router.query.referrer as string) || AppNavigation.Dashboard;
      router.push(referrer);
      return;
    }
  }, [router.query, user, error, isLoading]);
}
