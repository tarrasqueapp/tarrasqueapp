import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { createCampaign, updateCampaign } from '@/actions/campaigns';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { useGetCampaign } from '@/hooks/data/campaigns/useGetCampaign';
import { useCampaignStore } from '@/store/useCampaignStore';

interface CreateUpdateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
}

export function CreateUpdateCampaignModal({ open, onClose, campaignId }: CreateUpdateCampaignModalProps) {
  const { data: campaign } = useGetCampaign(campaignId);
  const modal = useCampaignStore((state) => state.modal);

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = z.object({ name: z.string().min(1) }).required();
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: campaign || { name: '' },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Reset the form when the campaign changes
  useEffect(() => {
    reset(campaign || { name: '' });
  }, [campaign, reset, modal]);

  /**
   * Handle the form submission
   * @param values - The campaign values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaignId) return;

    const response = campaign
      ? await updateCampaign({ id: campaignId, name: values.name })
      : await createCampaign(values);

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    onClose();
  }

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}
        >
          <DialogTitle>
            <span>{campaignId ? 'Update Campaign' : 'Create Campaign'}</span>

            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <ControlledTextField name="name" label="Name" autoFocus fullWidth />
          </DialogContent>

          <DialogActions>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton loading={isSubmitting} disabled={!isValid} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
