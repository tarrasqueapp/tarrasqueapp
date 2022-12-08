import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Role } from '../lib/types';
import { useGetRefreshToken } from './data/users/useGetRefreshToken';

export function useProtectedRoute(role: Role) {
  const { data: user, error } = useGetRefreshToken();

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Avoid looping redirects
    if (router.pathname !== '/sign-in') {
      // Sign out the user if there is an error getting the refresh token
      if (error) {
        router.push('/sign-out');
        return;
      }

      // Redirect to sign in page if the user is not signed in and the page is not public
      if (!user && role !== Role.GUEST) {
        router.push('/sign-in');
        return;
      }
    }

    // Don't allow lower role users to access higher role pages
    if (user && !user.roles.includes(role)) {
      router.push('/dashboard');
      return;
    }

    // Redirect to dashboard if already signed in
    if (user && role === Role.GUEST) {
      const referrer = (router.query.referrer as string) || '/dashboard';
      router.push(referrer);
      return;
    }
  }, [router.query, user, error]);
}
