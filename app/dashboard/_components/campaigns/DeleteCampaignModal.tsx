import { Alert, Box, CircularProgress, alpha } from '@mui/material';
import { toast } from 'react-hot-toast';

import { deleteCampaign } from '@/actions/campaigns';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useGetCampaign } from '@/hooks/data/campaigns/useGetCampaign';
import { Color } from '@/lib/colors';

interface DeleteCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
}

export function DeleteCampaignModal({ open, onClose, campaignId }: DeleteCampaignModalProps) {
  const { data: campaign } = useGetCampaign(campaignId);

  /**
   * Handle deleting a campaign
   */
  async function handleDeleteSelectedCampaign() {
    if (!campaignId) return;

    const response = await deleteCampaign({ id: campaignId });

    if (response?.error) {
      toast.error(response.error);
      return;
    }
  }

  return (
    <ConfirmModal title="Delete Campaign" open={open} onConfirm={handleDeleteSelectedCampaign} onClose={onClose}>
      {campaign ? (
        <>
          <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          You&apos;re about to delete the campaign &quot;<strong>{campaign.name}</strong>&quot; and all of its maps,
          characters, and associated data.
        </>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(Color.BLACK_LIGHT, 0.9),
          }}
        >
          <CircularProgress disableShrink />
        </Box>
      )}
    </ConfirmModal>
  );
}
