import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateMap } from '../../hooks/data/maps/useCreateMap';
import { useUpdateMap } from '../../hooks/data/maps/useUpdateMap';
import { useCreateMedia } from '../../hooks/data/media/useCreateMedia';
import { MapFactory } from '../../lib/factories/MapFactory';
import { CampaignInterface, MapInterface } from '../../lib/types';
import { store } from '../../store';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledUploader } from '../form/ControlledUploader';

interface IAddEditMapModalProps {
  open: boolean;
  onClose: () => void;
  map: MapInterface | null;
  campaign: CampaignInterface | null;
}

export const AddEditMapModal: React.FC<IAddEditMapModalProps> = observer(({ open, onClose, map, campaign }) => {
  const createMap = useCreateMap();
  const createMedia = useCreateMedia();
  const updateMap = useUpdateMap();

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    file: z.object({
      name: z.string().min(1),
      type: z.string().min(1),
      extension: z.string().min(1),
      size: z.number().min(1),
      width: z.number(),
      height: z.number(),
    }),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: map || new MapFactory(),
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Reset the form when the map changes
  useEffect(() => {
    reset(map || new MapFactory());
  }, [map, reset, store.maps.modal]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaign) return;

    if (map) {
      await updateMap.mutateAsync({ name: values.name, id: map.id, campaignId: campaign.id });
      onClose();
      return;
    }

    const media = await createMedia.mutateAsync(values.file);
    await createMap.mutateAsync({ name: values.name, mediaId: media.id, campaignId: campaign.id });
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <DialogTitle>{map?.name || 'Add Map'}</DialogTitle>

          <DialogContent>
            <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} autoFocus fullWidth />

            <Box sx={{ my: 1 }}>
              <ControlledUploader name="file" allowedFileTypes={['image/*', 'video/*']} />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>

            <LoadingButton loading={isSubmitting} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
});
