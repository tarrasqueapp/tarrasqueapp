import { Info } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, IconButton, Skeleton, Switch, Typography } from '@mui/material';
import Image from 'next/image';

import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';

interface Props {
  manifestUrl: string;
  enabled?: boolean;
  onEnable?: () => void;
  onDisable?: () => void;
}

export function CampaignPluginCard({ manifestUrl, enabled, onEnable, onDisable }: Props) {
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
        <Switch
          checked={enabled}
          disabled={!plugin}
          onChange={(event, checked) => {
            if (checked) {
              onEnable?.();
            } else {
              onDisable?.();
            }
          }}
        />
      </CardActions>
    </Card>
  );
}
