import { yupResolver } from '@hookform/resolvers/yup';
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
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateCampaign } from '../../hooks/data/campaigns/useCreateCampaign';
import { useUpdateCampaign } from '../../hooks/data/campaigns/useUpdateCampaign';
import { CampaignFactory } from '../../lib/factories/CampaignFactory';
import { CampaignInterface } from '../../lib/types';
import { store } from '../../store';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';

interface CreateUpdateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaign: CampaignInterface | undefined;
}

export const CreateUpdateCampaignModal: React.FC<CreateUpdateCampaignModalProps> = observer(
  ({ open, onClose, campaign }) => {
    const createCampaign = useCreateCampaign();
    const updateCampaign = useUpdateCampaign();

    const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Setup form validation schema
    const schema = yup
      .object({
        name: ValidateUtils.Name,
      })
      .required();
    type Schema = yup.InferType<typeof schema>;

    // Setup form
    const methods = useForm<Schema>({
      mode: 'onChange',
      resolver: yupResolver(schema),
      defaultValues: campaign || new CampaignFactory(),
    });
    const {
      handleSubmit,
      reset,
      formState: { isSubmitting, isValid },
    } = methods;

    // Reset the form when the campaign changes
    useEffect(() => {
      reset(campaign || new CampaignFactory());
    }, [campaign, reset, store.campaigns.modal]);

    /**
     * Handle the form submission
     * @param values - The campaign values
     */
    async function handleSubmitForm(values: Schema) {
      if (campaign) {
        updateCampaign.mutate({ ...values, id: campaign.id });
        onClose();
        return;
      }

      createCampaign.mutate(values);
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
              <span>{campaign ? 'Update Campaign' : 'Create Campaign'}</span>

              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <ControlledTextField name="name" label="Name" autoFocus fullWidth />
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
