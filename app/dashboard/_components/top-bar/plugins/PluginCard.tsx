import { Add, Info, Remove } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';

import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';

interface Props {
  manifestUrl: string;
  installed?: boolean;
  onInstall?: () => void;
  onUninstall?: () => void;
}

export function PluginCard({ manifestUrl, installed, onInstall, onUninstall }: Props) {
  const { data: plugin, isError } = useGetPlugin(manifestUrl);

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
          <Button variant="outlined" color="error" startIcon={<Remove />} onClick={onUninstall}>
            Uninstall
          </Button>
        ) : (
          <Button variant="outlined" startIcon={<Add />} disabled={!plugin} onClick={onInstall}>
            Install
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
