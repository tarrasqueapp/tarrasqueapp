import { yupResolver } from '@hookform/resolvers/yup';
import { Close, Delete, Email, Send } from '@mui/icons-material';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  MenuItem,
  TextField,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateCampaignInvite } from '../../hooks/data/campaigns/invites/useCreateCampaignInvite';
import { useDeleteCampaignInvite } from '../../hooks/data/campaigns/invites/useDeleteCampaignInvite';
import { useDeleteCampaignMember } from '../../hooks/data/campaigns/members/useDeleteCampaignMember';
import { useUpdateCampaignMember } from '../../hooks/data/campaigns/members/useUpdateCampaignMember';
import { CampaignInterface, CampaignMemberRole } from '../../lib/types';
import { store } from '../../store';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';

interface CampaignMembersModalProps {
  open: boolean;
  onClose: () => void;
  campaign: CampaignInterface | undefined;
}

export const CampaignMembersModal: React.FC<CampaignMembersModalProps> = observer(({ open, onClose, campaign }) => {
  const createCampaignInvite = useCreateCampaignInvite();
  const deleteCampaignInvite = useDeleteCampaignInvite();
  const deleteCampaignMember = useDeleteCampaignMember();
  const updateCampaignMember = useUpdateCampaignMember();

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = yup
    .object({
      email: ValidateUtils.Email,
    })
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Reset the form when the campaign changes
  useEffect(() => {
    reset({ email: '' });
  }, [campaign, reset, store.campaigns.modal]);

  /**
   * Handle the form submission
   * @param values - The campaign values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaign) return;
    createCampaignInvite.mutate({ campaign, email: values.email });
  }

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}
        >
          <DialogTitle>
            <span>Campaign Members</span>

            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Typography paragraph>Invite a friend to give them access to maps of this campaign.</Typography>

            <ControlledTextField
              name="email"
              label="Email"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Send">
                      <span>
                        <IconButton type="submit" disabled={isSubmitting || !isValid}>
                          <Send />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <List
              sx={{
                mt: 3,
                borderRadius: 2,
                overflow: 'hidden',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
              disablePadding
            >
              <ListSubheader>Members</ListSubheader>
              {Boolean(campaign?.members.length) ? (
                campaign?.members.map((member) => (
                  <ListItem
                    key={member.id}
                    secondaryAction={
                      <IconButton onClick={() => deleteCampaignMember.mutate({ campaign, member })}>
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={member.user.avatar?.thumbnailUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={member.user.displayName} secondary={member.user.email} />

                    <TextField
                      size="small"
                      label="Role"
                      select
                      value={member.role}
                      sx={{ mr: 2 }}
                      onChange={(event) => {
                        const role = event.target.value as CampaignMemberRole;
                        updateCampaignMember.mutate({ campaign, member: { ...member, role } });
                      }}
                    >
                      <MenuItem value={CampaignMemberRole.GAME_MASTER}>Game Master</MenuItem>
                      <MenuItem value={CampaignMemberRole.PLAYER}>Player</MenuItem>
                    </TextField>
                  </ListItem>
                ))
              ) : (
                <ListItem>No members</ListItem>
              )}
            </List>

            <List
              sx={{
                mt: 3,
                borderRadius: 2,
                overflow: 'hidden',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
              disablePadding
            >
              <ListSubheader>Pending invites</ListSubheader>
              {Boolean(campaign?.invites.length) ? (
                campaign?.invites.map((invite) => (
                  <ListItem
                    key={invite.id}
                    secondaryAction={
                      <IconButton onClick={() => deleteCampaignInvite.mutate({ campaign, invite })}>
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Email />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={invite.email} />
                  </ListItem>
                ))
              ) : (
                <ListItem>No pending invites</ListItem>
              )}
            </List>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
});
