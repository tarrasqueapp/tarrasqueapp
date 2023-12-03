import { yupResolver } from '@hookform/resolvers/yup';
import { Close, Delete, Email, Send } from '@mui/icons-material';
import {
  Avatar,
  Box,
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

import { CampaignEntity, Role } from '@tarrasque/common';

import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useCreateInvite } from '../../hooks/data/campaigns/invites/useCreateInvite';
import { useDeleteInvite } from '../../hooks/data/campaigns/invites/useDeleteInvite';
import { useDeleteMembership } from '../../hooks/data/campaigns/memberships/useDeleteMembership';
import { useUpdateMembership } from '../../hooks/data/campaigns/memberships/useUpdateMembership';
import { store } from '../../store';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ColorPicker } from '../ColorPicker';
import { ControlledTextField } from '../form/ControlledTextField';

interface CampaignMembersModalProps {
  open: boolean;
  onClose: () => void;
  campaign: CampaignEntity | undefined;
}

export const CampaignMembersModal = observer(function CampaignMembersModal({
  open,
  onClose,
  campaign,
}: CampaignMembersModalProps) {
  const { data: user } = useGetUser();
  const createInvite = useCreateInvite();
  const deleteInvite = useDeleteInvite();
  const deleteMembership = useDeleteMembership();
  const updateMembership = useUpdateMembership();

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
    try {
      await createInvite.mutateAsync({ campaignId: campaign.id, email: values.email });
    } catch (error) {
      console.error(error);
    }
    reset({ email: '' });
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

              {Boolean(campaign?.memberships.length) ? (
                campaign?.memberships.map((membership) => (
                  <ListItem
                    sx={{ flexWrap: 'wrap' }}
                    key={membership.userId}
                    secondaryAction={
                      <IconButton
                        disabled={membership.userId === user?.id}
                        onClick={() => deleteMembership.mutate(membership)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={membership.user.avatar?.thumbnailUrl}>{membership.user.displayName[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={membership.user.displayName} secondary={membership.user.email} />

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                        gap: 2,
                        mr: 2,
                      }}
                    >
                      <TextField
                        disabled={membership.userId === user?.id}
                        size="small"
                        label="Role"
                        select
                        value={membership.role}
                        onChange={(event) => {
                          const role = event.target.value as Role;
                          updateMembership.mutate({ ...membership, role });
                        }}
                      >
                        <MenuItem value={Role.GAME_MASTER}>Game Master</MenuItem>
                        <MenuItem value={Role.PLAYER}>Player</MenuItem>
                      </TextField>

                      <ColorPicker
                        value={membership.color}
                        onChange={(color) => {
                          updateMembership.mutate({ ...membership, color });
                        }}
                      />
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ListItem>No members found</ListItem>
              )}
            </List>

            <List
              sx={{
                mt: 3,
                borderRadius: 2,
                overflow: 'hidden',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                pb: 1,
              }}
              disablePadding
            >
              <ListSubheader>Pending invites</ListSubheader>

              {Boolean(campaign?.invites.length) &&
                campaign?.invites.map((invite) => (
                  <ListItem
                    key={invite.id}
                    secondaryAction={
                      <IconButton onClick={() => deleteInvite.mutate(invite)}>
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
                ))}

              {!campaign?.invites.length && <ListItem>No pending invites found</ListItem>}
            </List>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
});
