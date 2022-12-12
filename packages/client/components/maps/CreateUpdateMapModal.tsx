import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Theme, useMediaQuery } from '@mui/material';
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
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledUploader } from '../form/ControlledUploader';

interface ICreateUpdateMapModalProps {
  open: boolean;
  onClose: () => void;
  map: MapInterface | null;
  campaign: CampaignInterface | null;
}

export const CreateUpdateMapModal: React.FC<ICreateUpdateMapModalProps> = observer(
  ({ open, onClose, map, campaign }) => {
    const createMap = useCreateMap();
    const createMedia = useCreateMedia();
    const updateMap = useUpdateMap();

    const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Setup form validation schema
    const schema = z.object({
      name: ValidateUtils.Name,
      media: z.union([ValidateUtils.File, ValidateUtils.Media]),
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
      formState: { isSubmitting, isValid },
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
        const media = ValidateUtils.File.safeParse(values.media).success
          ? await createMedia.mutateAsync(values.media)
          : null;

        await updateMap.mutateAsync({
          name: values.name,
          id: map.id,
          campaignId: campaign.id,
          ...(media && { mediaId: media.id }),
        });
        onClose();
        return;
      }

      const media = await createMedia.mutateAsync(values.media);
      await createMap.mutateAsync({ name: values.name, mediaId: media.id, campaignId: campaign.id });
      onClose();
    }

    return (
      <Dialog fullScreen={fullScreen} fullWidth maxWidth="xs" onClose={onClose} open={open}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}
          >
            <DialogTitle>{map ? 'Update Map' : 'Create Map'}</DialogTitle>

            <DialogContent>
              <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} autoFocus fullWidth />

              <Box sx={{ my: 1 }}>
                <ControlledUploader name="media" allowedFileTypes={['image/*', 'video/*']} />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>

              <LoadingButton loading={isSubmitting} disabled={!isValid} variant="contained" type="submit">
                Submit
              </LoadingButton>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    );
  },
);
