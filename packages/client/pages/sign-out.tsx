import { Box, CircularProgress } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

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
    <Box sx={{ display: 'flex', flex: '1 0 auto', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress disableShrink />
    </Box>
  );
};

export default SignOutPage;
