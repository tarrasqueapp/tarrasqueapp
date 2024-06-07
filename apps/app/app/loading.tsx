import { CircularProgress } from '@mui/material';

import { Center } from '@/components/Center';

export default function Loading() {
  return (
    <Center>
      <CircularProgress disableShrink />
    </Center>
  );
}
