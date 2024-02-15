import { Add, Info, Remove } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';

interface Props {
  manifestUrl: string;
  installed?: boolean;
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
}

export function PluginCard({ manifestUrl, installed, onInstall, onUninstall }: Props) {
  const { data: plugin, isError } = useGetPlugin(manifestUrl);

  const [pending, setPending] = useState(false);

  if (isError) return null;

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          plugin ? (
            <Image src={plugin.icon_url} alt={plugin.name} width={30} height={30} />
          ) : (
            <Skeleton width={30} height={30} />
          )
        }
        title={plugin?.name || <Skeleton width={150} height={15} />}
        subheader={plugin?.author || <Skeleton width={100} height={15} sx={{ mt: 0.5 }} />}
        action={
          <IconButton
            disabled={!plugin}
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={plugin?.homepage_url}
          >
            <Info />
          </IconButton>
        }
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {plugin?.description || <Skeleton height={40} />}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', m: 0.5 }}>
        {installed ? (
          <Button
            variant="outlined"
            color="error"
            disabled={pending}
            startIcon={<Remove />}
            onClick={async () => {
              setPending(true);
              await onUninstall?.();
              setPending(false);
            }}
          >
            Uninstall
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Add />}
            disabled={!plugin || pending}
            onClick={async () => {
              setPending(true);
              await onInstall?.();
              setPending(false);
            }}
          >
            Install
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
