import { Close } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Theme, useMediaQuery } from '@mui/material';

import { Campaign } from '@/actions/campaigns';
import { disableCampaignPlugin, enableCampaignPlugin } from '@/actions/plugins';
import { useGetCampaignPlugins } from '@/hooks/data/campaigns/plugins/useGetCampaignPlugins';
import { useGetUserPlugins } from '@/hooks/data/plugins/useGetUserPlugins';
import { CampaignPluginEntity, PluginEntity } from '@/lib/types';

import { Plugin } from '../dashboard/TopBar/Plugins/Plugin';

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
  function handleEnablePlugin(plugin: PluginEntity) {
    if (!campaign || !plugin) return;

    enableCampaignPlugin({ campaign_id: campaign.id, plugin_id: plugin.id });
  }

  /**
   * Disable a plugin from the campaign
   * @param campaignPlugin - The campaign plugin to disable
   */
  function handleDisablePlugin(campaignPlugin: CampaignPluginEntity) {
    if (!campaignPlugin) return;

    disableCampaignPlugin(campaignPlugin.id);
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
                  <Plugin
                    key={userPlugin.id}
                    manifestUrl={userPlugin.manifest_url}
                    installed={Boolean(
                      campaignPlugins?.find((campaignPlugin) => campaignPlugin.plugin_id === userPlugin.id),
                    )}
                    onInstall={() => handleEnablePlugin(userPlugin)}
                    onUninstall={() => {
                      const campaignPlugin = campaignPlugins?.find(
                        (campaignPlugin) => campaignPlugin.plugin_id === userPlugin.id,
                      );
                      if (campaignPlugin) handleDisablePlugin(campaignPlugin);
                    }}
                  />
                ))
              : [...Array(2)].map((_, i) => <Plugin key={i} manifestUrl="" />)}
          </Masonry>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
