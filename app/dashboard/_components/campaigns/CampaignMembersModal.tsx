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
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { Campaign } from '@/actions/campaigns';
import { CampaignMemberRole, deleteMembership, updateMembership } from '@/actions/memberships';
import { UserAvatar } from '@/components/UserAvatar';
import { ColorPicker } from '@/components/color-picker/ColorPicker';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useCreateInvite } from '@/hooks/data/campaigns/invites/useCreateInvite';
import { useDeleteInvite } from '@/hooks/data/campaigns/invites/useDeleteInvite';
import { useGetInvites } from '@/hooks/data/campaigns/invites/useGetInvites';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useCampaignStore } from '@/store/campaign';

interface CampaignMembersModalProps {
  open: boolean;
  onClose: () => void;
  campaign: Campaign | undefined;
}

export function CampaignMembersModal({ open, onClose, campaign }: CampaignMembersModalProps) {
  const { data: memberships } = useGetMemberships(campaign?.id || '');
  const { data: invites } = useGetInvites(campaign?.id || '');
  const { data: user } = useGetUser();
  const createInvite = useCreateInvite();
  const deleteInvite = useDeleteInvite();

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
  }, [campaign, reset, modal]);

  /**
   * Handle the form submission
   * @param values - The campaign values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaign) return;

    try {
      await createInvite.mutateAsync({ campaign_id: campaign.id, email: values.email });
      reset({ email: '' });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
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
                    <IconButton onClick={() => deleteInvite.mutate({ id: invite.id, campaign_id: campaign?.id })}>
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
