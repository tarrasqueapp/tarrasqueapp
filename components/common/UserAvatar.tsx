import { Avatar } from '@mui/material';
import Image from 'next/image';

import { Profile } from '@/actions/profiles';
import { storageImageLoader } from '@/lib/storageImageLoader';

interface Props {
  profile: Profile | null | undefined;
  size?: 'small' | 'medium';
}

export function UserAvatar({ profile, size = 'medium' }: Props) {
  if (!profile) {
    return (
      <Avatar
        sx={{
          width: size === 'medium' ? 40 : 24,
          height: size === 'medium' ? 40 : 24,
          ...(size === 'small' && { fontSize: '1rem' }),
        }}
      />
    );
  }

  if (size === 'small') {
    return (
      <Avatar sx={{ width: 24, height: 24, fontSize: '1rem' }}>
        {profile?.avatar?.url ? (
          <Image loader={storageImageLoader} src={profile.avatar.url} width={24} height={24} alt="" />
        ) : (
          profile?.display_name[0]
        )}
      </Avatar>
    );
  }

  return (
    <Avatar sx={{ width: 40, height: 40 }}>
      {profile?.avatar?.url ? (
        <Image loader={storageImageLoader} src={profile.avatar.url} width={40} height={40} alt="" />
      ) : (
        profile?.display_name[0]
      )}
    </Avatar>
  );
}
