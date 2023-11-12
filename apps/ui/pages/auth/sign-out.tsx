import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Center } from '../../components/common/Center';
import { useSignOut } from '../../hooks/data/auth/useSignOut';
import { AppNavigation } from '../../lib/navigation';

export default function SignOutPage() {
  const signOut = useSignOut();

  const router = useRouter();

  useEffect(() => {
    // Sign out the user and redirect to the sign in page
    try {
      signOut.mutate();
    } catch (err) {}

    router.push(AppNavigation.SignIn);
  }, []);

  return (
    <Center>
      <CircularProgress disableShrink />
    </Center>
  );
}
