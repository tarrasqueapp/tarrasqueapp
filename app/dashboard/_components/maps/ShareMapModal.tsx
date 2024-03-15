import { Close } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

import { Map, updateMap } from '@/actions/maps';
import { useOptimistic } from '@/hooks/useOptimistic';
import { config } from '@/lib/config';
import { AppNavigation } from '@/lib/navigation';

interface ShareMapModalProps {
  open: boolean;
  onClose: () => void;
  map: Map | undefined;
}

export function ShareMapModal({ open, onClose, map }: ShareMapModalProps) {
  const [optimisticVisible, setOptimisticVisible] = useOptimistic(
    map?.visible ?? false,
    (current, payload: boolean) => payload,
  );
  const inviteLinkRef = useRef<HTMLInputElement | null>(null);
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  /**
   * Copy input field content to clipboard
   */
  function handleFocus() {
    if (!inviteLinkRef.current) return;
    inviteLinkRef.current.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inviteLinkRef.current.value);
    toast.success('Copied to clipboard!');
  }

  /**
   * Select the input field content
   */
  function handleSelect() {
    if (!inviteLinkRef.current) return;
    inviteLinkRef.current.select();
  }

  /**
   * Toggles the visibility of the map to the campaign players
   */
  async function handleToggleVisibility() {
    if (!map) return;
    const newValue = !map.visible;
    setOptimisticVisible(newValue);
    await updateMap({ id: map.id, visible: newValue });
  }

  if (!map) return null;

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>
        <span>Share Map</span>

        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Invite Link"
              fullWidth
              autoComplete="off"
              value={`${config.SITE_URL}${AppNavigation.Map}/${map.id}`}
              onFocus={handleFocus}
              inputRef={inviteLinkRef}
            />

            <Button variant="contained" onClick={handleSelect}>
              Copy
            </Button>
          </Stack>

          <FormControlLabel
            label="Visible to campaign players"
            control={
              <Checkbox
                checked={optimisticVisible}
                onChange={handleToggleVisibility}
                sx={{ pl: 0 }}
                disabled={map.visible !== optimisticVisible}
              />
            }
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
