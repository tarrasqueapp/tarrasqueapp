import { Avatar, Badge } from '@mui/material';
import Image from 'next/image';

import { Profile } from '@/actions/profiles';
import { useJoinUserChannel } from '@/hooks/realtime/useJoinUserChannel';
import { supabaseLoader } from '@/lib/supabaseLoader';

interface Props {
  profile?: Partial<Profile> | null;
  size?: 'small' | 'medium';
}

export function UserAvatar({ profile, size = 'medium' }: Props) {
  const { isOnline } = useJoinUserChannel(profile?.id);

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
      <Badge
        variant="dot"
        badgeContent={isOnline ? 1 : 0}
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar sx={{ width: 24, height: 24, fontSize: '1rem' }}>
          {profile?.avatar?.url ? (
            <Image loader={supabaseLoader} src={profile.avatar.url} width={24} height={24} alt="" />
          ) : (
            profile?.name?.[0]
          )}
        </Avatar>
      </Badge>
    );
  }

  return (
    <Badge
      variant="dot"
      badgeContent={isOnline ? 1 : 0}
      color="success"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Avatar sx={{ width: 40, height: 40 }}>
        {profile?.avatar?.url ? (
          <Image loader={supabaseLoader} src={profile.avatar.url} width={40} height={40} alt="" />
        ) : (
          profile?.name?.[0]
        )}
      </Avatar>
    </Badge>
  );
}
