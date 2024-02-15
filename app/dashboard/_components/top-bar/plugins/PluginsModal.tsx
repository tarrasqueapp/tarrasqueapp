'use client';

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

import { installPlugin, uninstallPlugin } from '@/actions/plugins';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { useGetSubmittedPlugins } from '@/hooks/data/plugins/useGetSubmittedPlugins';
import { useGetUserPlugins } from '@/hooks/data/plugins/useGetUserPlugins';
import { validate } from '@/lib/validate';

import { PluginCard } from './PluginCard';

interface PluginsModalProps {
  open: boolean;
  onClose: () => void;
}

export function PluginsModal({ open, onClose }: PluginsModalProps) {
  const { data: submittedPlugins } = useGetSubmittedPlugins();
  const { data: userPlugins } = useGetUserPlugins();

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
  }, [reset, open]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    // Install the plugin
    await handleInstall(values.manifest_url);

    reset({ manifest_url: '' });
  }

  /**
   * Install a plugin from the submitted plugins
   * @param manifestUrl - The manifest URL of the plugin to install
   */
  async function handleInstall(manifestUrl: string) {
    await installPlugin({ manifest_url: manifestUrl });
  }

  /**
   * Uninstall a plugin from the campaign
   * @param plugin - The plugin to uninstall
   */
  async function handleUninstall(pluginId: string) {
    await uninstallPlugin(pluginId);
  }

  const unlistedInstalledPlugins = userPlugins?.filter((plugin) => !submittedPlugins?.includes(plugin.manifest_url));

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
            {unlistedInstalledPlugins?.map((plugin) => (
              <PluginCard
                key={plugin.id}
                manifestUrl={plugin.manifest_url}
                installed
                onUninstall={() => handleUninstall(plugin.id)}
              />
            ))}

            {submittedPlugins
              ? submittedPlugins.map((manifestUrl, index) => (
                  <PluginCard
                    key={index}
                    manifestUrl={manifestUrl}
                    installed={userPlugins?.some((plugin) => plugin.manifest_url === manifestUrl)}
                    onInstall={() => handleInstall(manifestUrl)}
                    onUninstall={async () => {
                      const plugin = userPlugins?.find((plugin) => plugin.manifest_url === manifestUrl);
                      if (plugin) await handleUninstall(plugin.id);
                    }}
                  />
                ))
              : [...Array(2)].map((_, i) => <PluginCard key={i} manifestUrl="" />)}
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
