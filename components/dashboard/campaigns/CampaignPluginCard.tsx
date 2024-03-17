import { Info } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, IconButton, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';

import { IOSSwitch } from '@/components/IOSSwitch';
import { useGetCampaignPlugins } from '@/hooks/data/campaigns/plugins/useGetCampaignPlugins';
import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';
import { useOptimistic } from '@/hooks/useOptimistic';

interface Props {
  manifestUrl: string;
  campaignId?: string;
  enabled?: boolean;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
}

export function CampaignPluginCard({ manifestUrl, campaignId, enabled, onEnable, onDisable }: Props) {
  const { data: campaignPlugins } = useGetCampaignPlugins(campaignId);
  const { data: plugin, isError } = useGetPlugin(manifestUrl);

  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled, (current, payload: boolean) => payload);

  const iconUrl = plugin?.urls.find((url) => url.name === 'icon')?.url || '';
  const homepageUrl = plugin?.urls.find((url) => url.name === 'homepage')?.url || '';

  if (isError) return null;

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
        <IOSSwitch
          checked={optimisticEnabled}
          disabled={!plugin || !campaignPlugins || enabled !== optimisticEnabled}
          onChange={async (event, checked) => {
            if (checked) {
              setOptimisticEnabled(true);
              await onEnable?.();
            } else {
              setOptimisticEnabled(false);
              await onDisable?.();
            }
          }}
        />
      </CardActions>
    </Card>
  );
}
