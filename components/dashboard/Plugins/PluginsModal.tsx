import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Close } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Theme,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Campaign } from '@/actions/campaigns';
import { installPlugin, uninstallPlugin } from '@/actions/plugins';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { useGetCampaignPlugins } from '@/hooks/data/campaigns/plugins/useGetCampaignPlugins';
import { useGetSubmittedPlugins } from '@/hooks/data/plugins/useGetSubmittedPlugins';
import { PluginEntity, SubmittedPluginEntity } from '@/lib/types';
import { validate } from '@/lib/validate';

import { Plugin } from './Plugin';

interface PluginsModalProps {
  open: boolean;
  onClose: () => void;
  campaign?: Campaign;
}

export function PluginsModal({ open, onClose, campaign }: PluginsModalProps) {
  const { data: submittedPlugins } = useGetSubmittedPlugins();
  const { data: campaignPlugins } = useGetCampaignPlugins(campaign?.id || '');

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = z.object({
    manifest_url: validate.fields.manifestUrl,
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: { manifest_url: '' },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Reset the form when the map changes
  useEffect(() => {
    reset({ manifest_url: '' });
  }, [campaign, reset, open]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaign) return;

    // Update the plugin
    const plugin = await installPlugin({
      campaign_id: campaign.id,
      manifest_url: values.manifest_url,
    });

    console.log(plugin);

    reset({ manifest_url: '' });
  }

  /**
   * Install a plugin from the submitted plugins
   * @param plugin - The plugin to install
   */
  function handleInstall(plugin: SubmittedPluginEntity) {
    if (!campaign) return;

    installPlugin({
      campaign_id: campaign.id,
      manifest_url: plugin.manifest_url,
    });
  }

  /**
   * Uninstall a plugin from the campaign
   * @param plugin - The plugin to uninstall
   */
  function handleUninstall(plugin: PluginEntity) {
    uninstallPlugin(plugin.id);
  }

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>
        <span>Plugins</span>

        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ my: 1 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            {campaignPlugins
              ? campaignPlugins.map((plugin) => (
                  <Plugin
                    key={plugin.id}
                    manifestUrl={plugin.manifest_url}
                    installed
                    onUninstall={() => handleUninstall(plugin)}
                  />
                ))
              : [...Array(2)].map((_, i) => <Plugin key={i} manifestUrl="" />)}

            {submittedPlugins
              ? submittedPlugins
                  .filter((plugin) => !campaignPlugins?.find((p) => p.manifest_url === plugin.manifest_url))
                  .map((plugin) => (
                    <Plugin key={plugin.id} manifestUrl={plugin.manifest_url} onInstall={() => handleInstall(plugin)} />
                  ))
              : [...Array(2)].map((_, i) => <Plugin key={i} manifestUrl="" />)}
          </Masonry>
        </Box>

        <Box sx={{ mt: 4 }}>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}
            >
              <ControlledTextField
                name="manifest_url"
                label="Manifest URL"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Install">
                        <span>
                          <IconButton type="submit" disabled={isSubmitting || !isValid}>
                            <Add />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </FormProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
