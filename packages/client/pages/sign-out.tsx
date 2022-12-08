import { CircularProgress } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Center } from '../components/common/Center';
import { useSignOut } from '../hooks/data/users/useSignOut';

const SignOutPage: NextPage = () => {
  const signOut = useSignOut();
  const router = useRouter();

  useEffect(() => {
    // Sign out the user and redirect to the sign in page
    try {
      signOut.mutate();
    } catch (err) {}

    router.push('/sign-in');
  }, []);

  return (
    <Center>
      <CircularProgress disableShrink color="secondary" />
    </Center>
  );
};

export default SignOutPage;
