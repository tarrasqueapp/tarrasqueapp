import { zodResolver } from '@hookform/resolvers/zod';
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
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createInvite, deleteInvite } from '@/actions/invites';
import { CampaignMemberRole, deleteMembership, updateMembership } from '@/actions/memberships';
import { UserAvatar } from '@/components/account/UserAvatar';
import { ColorPicker } from '@/components/color-picker/ColorPicker';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetInvites } from '@/hooks/data/campaigns/invites/useGetInvites';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useCampaignStore } from '@/store/useCampaignStore';

interface CampaignMembersModalProps {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
}

export function CampaignMembersModal({ open, onClose, campaignId }: CampaignMembersModalProps) {
  const { data: memberships } = useGetMemberships(campaignId);
  const { data: invites } = useGetInvites(campaignId);
  const { data: user } = useGetUser();

  const modal = useCampaignStore((state) => state.modal);

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = z.object({
    email: z.string().email(),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
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
  }, [campaignId, reset, modal]);

  /**
   * Handle the form submission
   * @param values - The campaign values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaignId) return;
    createInvite({ campaign_id: campaignId, email: values.email });
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

              {memberships?.length ? (
                memberships?.map((membership) => (
                  <ListItem
                    sx={{ flexWrap: 'wrap' }}
                    key={membership.user_id}
                    secondaryAction={
                      <IconButton
                        disabled={membership.user_id === user?.id}
                        onClick={() => deleteMembership({ id: membership.id })}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <UserAvatar profile={membership.user} />
                    </ListItemAvatar>
                    <ListItemText primary={membership.user?.name} secondary={membership.user?.email} />

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
                        disabled={membership.user_id === user?.id}
                        size="small"
                        label="Role"
                        select
                        value={membership.role}
                        onChange={(event) => {
                          const role = event.target.value as CampaignMemberRole;
                          updateMembership({ id: membership.id, role });
                        }}
                      >
                        <MenuItem value="GAME_MASTER">Game Master</MenuItem>
                        <MenuItem value="PLAYER">Player</MenuItem>
                      </TextField>

                      <ColorPicker
                        value={membership.color}
                        onChange={(color) => updateMembership({ id: membership.id, color })}
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

              {invites?.map((invite) => (
                <ListItem
                  key={invite.id}
                  secondaryAction={
                    <IconButton onClick={() => deleteInvite({ id: invite.id })}>
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

              {!invites?.length && <ListItem>No pending invites found</ListItem>}
            </List>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
}
