import { Close } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Theme, Typography, useMediaQuery } from '@mui/material';

import { Campaign } from '@/actions/campaigns';
import { CampaignPlugin, Plugin, disableCampaignPlugin, enableCampaignPlugin } from '@/actions/plugins';
import { useGetCampaignPlugins } from '@/hooks/data/campaigns/plugins/useGetCampaignPlugins';
import { useGetUserPlugins } from '@/hooks/data/plugins/useGetUserPlugins';
import { Color } from '@/lib/colors';

import { CampaignPluginCard } from './CampaignPluginCard';

interface CampaignPluginsModalProps {
  open: boolean;
  onClose: () => void;
  campaign?: Campaign;
}

export function CampaignPluginsModal({ open, onClose, campaign }: CampaignPluginsModalProps) {
  const { data: userPlugins } = useGetUserPlugins();
  const { data: campaignPlugins } = useGetCampaignPlugins(campaign?.id || '');

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  /**
   * Enable a plugin from the installed plugins
   * @param plugin - The plugin to install
   */
  async function handleEnablePlugin(plugin: Plugin) {
    if (!campaign || !plugin) return;

    await enableCampaignPlugin({ campaign_id: campaign.id, plugin_id: plugin.id });
  }

  /**
   * Disable a plugin from the campaign
   * @param campaignPlugin - The campaign plugin to disable
   */
  async function handleDisablePlugin(campaignPlugin: CampaignPlugin) {
    if (!campaignPlugin) return;

    await disableCampaignPlugin(campaignPlugin.id);
  }

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>
        <span>Campaign Plugins</span>

        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ my: 1 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            {userPlugins
              ? userPlugins.map((userPlugin) => (
                  <CampaignPluginCard
                    key={userPlugin.id}
                    manifestUrl={userPlugin.manifest_url}
                    campaign={campaign}
                    enabled={Boolean(
                      campaignPlugins?.find((campaignPlugin) => campaignPlugin.plugin_id === userPlugin.id),
                    )}
                    onEnable={() => handleEnablePlugin(userPlugin)}
                    onDisable={async () => {
                      const campaignPlugin = campaignPlugins?.find(
                        (campaignPlugin) => campaignPlugin.plugin_id === userPlugin.id,
                      );
                      if (campaignPlugin) await handleDisablePlugin(campaignPlugin);
                    }}
                  />
                ))
              : [...Array(2)].map((_, i) => <CampaignPluginCard key={i} manifestUrl="" />)}
          </Masonry>

          {userPlugins?.length === 0 && (
            <Typography align="center" sx={{ my: 8 }} color={Color.GREY}>
              No plugins installed
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
