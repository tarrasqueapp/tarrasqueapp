import { Add, Feedback, Info, Remove } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';

import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';
import { useOptimistic } from '@/hooks/useOptimistic';

interface Props {
  manifestUrl: string;
  installed?: boolean;
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
}

export function PluginCard({ manifestUrl, installed, onInstall, onUninstall }: Props) {
  const { data: plugin, isError } = useGetPlugin(manifestUrl);

  const [optimisticInstalled, setOptimisticInstalled] = useOptimistic(
    installed,
    (current, payload: boolean) => payload,
  );

  const iconUrl = plugin?.urls.find((url) => url.name === 'icon')?.url || '';
  const homepageUrl = plugin?.urls.find((url) => url.name === 'homepage')?.url || '';

  if (isError) {
    return (
      <Card variant="outlined">
        <CardHeader avatar={<Feedback color="error" />} title="Failed to load plugin" subheader={manifestUrl} />

        <CardActions sx={{ justifyContent: 'flex-end', m: 0.5 }}>
          <Button
            variant="outlined"
            disabled={(!plugin && !isError) || installed !== optimisticInstalled}
            color="error"
            startIcon={<Remove />}
            onClick={async () => {
              setOptimisticInstalled(false);
              await onUninstall?.();
            }}
          >
            Uninstall
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          plugin ? (
            <Image src={iconUrl} alt={plugin.name} width={30} height={30} />
          ) : (
            <Skeleton width={30} height={30} />
          )
        }
        title={plugin?.name || <Skeleton width={150} height={15} />}
        subheader={plugin?.author || <Skeleton width={100} height={15} sx={{ mt: 0.5 }} />}
        action={
          <IconButton disabled={!plugin} component="a" target="_blank" rel="noopener noreferrer" href={homepageUrl}>
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
        {optimisticInstalled ? (
          <Button
            variant="outlined"
            disabled={(!plugin && !isError) || installed !== optimisticInstalled}
            color="error"
            startIcon={<Remove />}
            onClick={async () => {
              setOptimisticInstalled(false);
              await onUninstall?.();
            }}
          >
            Uninstall
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Add />}
            disabled={(!plugin && !isError) || installed !== optimisticInstalled}
            onClick={async () => {
              setOptimisticInstalled(true);
              await onInstall?.();
            }}
          >
            Install
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
