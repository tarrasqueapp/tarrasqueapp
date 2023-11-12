import {
  AspectRatio,
  Brush,
  Cancel,
  Category,
  Close,
  ControlCamera,
  Delete,
  Done,
  DragHandle,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Forum,
  GridOn,
  Keyboard,
  Link,
  LooksOne,
  LooksTwo,
  PanTool,
  PushPin,
  Redo,
  SkipNext,
  SquareFoot,
  Stars,
  TouchApp,
  Undo,
  Visibility,
  VisibilityOff,
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
} from '@mui/icons-material';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { HotkeysUtils } from '../../../utils/HotkeyUtils';
import { CharacterIcon } from '../../icons/CharacterIcon';
import { MapIcon } from '../../icons/MapIcon';

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>
        <span>Shortcuts</span>

        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline">Tokens</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <TouchApp />
                </ListItemIcon>
                <ListItemText primary="Select Tool" />
                <Chip label={HotkeysUtils.Select} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <DragHandle />
                </ListItemIcon>
                <ListItemText primary="Move Token" />
                <Chip label={HotkeysUtils.Up} />
                &nbsp;
                <Chip label={HotkeysUtils.Down} />
                &nbsp;
                <Chip label={HotkeysUtils.Left} />
                &nbsp;
                <Chip label={HotkeysUtils.Right} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <AspectRatio />
                </ListItemIcon>
                <ListItemText primary="Maintain Aspect Ratio" />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Chip label="shift" />
                  <div style={{ marginLeft: 4, marginRight: 2 }}>+</div>
                  <TouchApp />
                </div>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Delete />
                </ListItemIcon>
                <ListItemText primary="Delete Token" />
                <Chip label={HotkeysUtils.Delete1} />
                <span style={{ marginLeft: 2, marginRight: 2 }}>/</span>
                <Chip label={HotkeysUtils.Delete2} />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Battle Map</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <PanTool />
                </ListItemIcon>
                <ListItemText primary="Pan Tool" />
                <Chip label={HotkeysUtils.Pan} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <GridOn />
                </ListItemIcon>
                <ListItemText primary="Grid" />
                <Chip label={HotkeysUtils.Grid} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <ControlCamera />
                </ListItemIcon>
                <ListItemText primary="Move Canvas" />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Chip label={HotkeysUtils.TemporaryPan} />
                  <span style={{ marginLeft: 2, marginRight: 2 }}>/</span>
                  <Chip label="MMB" />
                  <div style={{ marginLeft: 4, marginRight: 2 }}>+</div>
                  <PanTool />
                </div>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <ZoomIn />
                </ListItemIcon>
                <ListItemText primary="Zoom In" />
                <Chip label={HotkeysUtils.ZoomIn} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <ZoomOut />
                </ListItemIcon>
                <ListItemText primary="Zoom Out" />
                <Chip label={HotkeysUtils.ZoomOut} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <ZoomOutMap />
                </ListItemIcon>
                <ListItemText primary="Zoom to Fit" />
                <Chip label={HotkeysUtils.ZoomToFit} />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Fog of War</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <VisibilityOff />
                </ListItemIcon>
                <ListItemText primary="Fog Tool" />
                <Chip label={HotkeysUtils.Fog} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Visibility />
                </ListItemIcon>
                <ListItemText primary="Hide/Reveal" />
                <Chip label={HotkeysUtils.Fog} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Undo />
                </ListItemIcon>
                <ListItemText primary="Revert Last Point" />
                <Chip label="RMB" />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Done />
                </ListItemIcon>
                <ListItemText primary="Finish Drawing" />
                <Chip label={HotkeysUtils.Submit} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Cancel />
                </ListItemIcon>
                <ListItemText primary="Cancel Drawing" />
                <Chip label={HotkeysUtils.Cancel} />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Drawing Board</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Brush />
                </ListItemIcon>
                <ListItemText primary="Draw Tool" />
                <Chip label={HotkeysUtils.Draw} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>{/* <Eraser /> */}</ListItemIcon>
                <ListItemText primary="Eraser" />
                <Chip label={HotkeysUtils.Draw} />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Area of Effect</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Category />
                </ListItemIcon>
                <ListItemText primary="Shape Tool" />
                <Chip label={HotkeysUtils.Shape} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <SkipNext />
                </ListItemIcon>
                <ListItemText primary="Next Shape" />
                <Chip label={HotkeysUtils.Shape} />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline">Measurements</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <SquareFoot />
                </ListItemIcon>
                <ListItemText primary="Measure Tool" />
                <Chip label={HotkeysUtils.Measure} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Link />
                </ListItemIcon>
                <ListItemText primary="Chain Measurement" />
                <Chip label="RMB" />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Notes</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <PushPin />
                </ListItemIcon>
                <ListItemText primary="Note Tool" />
                <Chip label={HotkeysUtils.Note} />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">User Interface</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <CharacterIcon />
                </ListItemIcon>
                <ListItemText primary="Adventurers" />
                <Chip label={HotkeysUtils.Adventurers} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Battle Maps" />
                <Chip label={HotkeysUtils.BattleMaps} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Forum />
                </ListItemIcon>
                <ListItemText primary="Chat" />
                <Chip label={HotkeysUtils.Chat} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>{/* <Swords /> */}</ListItemIcon>
                <ListItemText primary="Combat Tracker" />
                <Chip label={HotkeysUtils.CombatTracker} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>{/* <Dragon /> */}</ListItemIcon>
                <ListItemText primary="Monsters" />
                <Chip label={HotkeysUtils.Monsters} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>{/* <Spellbook /> */}</ListItemIcon>
                <ListItemText primary="Spells" />
                <Chip label={HotkeysUtils.Spells} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Stars />
                </ListItemIcon>
                <ListItemText primary="Objects" />
                <Chip label={HotkeysUtils.Objects} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>{/* <Icosahedron /> */}</ListItemIcon>
                <ListItemText primary="Dice Roller" />
                <Chip label={HotkeysUtils.DiceRoller} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Keyboard />
                </ListItemIcon>
                <ListItemText primary="Shortcuts" />
                <Chip label={HotkeysUtils.Shortcuts} />
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Text Editor</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <FormatBold />
                </ListItemIcon>
                <ListItemText primary="Bold" />
                <ListItemSecondaryAction>
                  <Chip label={HotkeysUtils.Bold} />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <FormatItalic />
                </ListItemIcon>
                <ListItemText primary="Italic" />
                <ListItemSecondaryAction>
                  <Chip label={HotkeysUtils.Italic} />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <FormatUnderlined />
                </ListItemIcon>
                <ListItemText primary="Underline" />
                <ListItemSecondaryAction>
                  <Chip label={HotkeysUtils.Underline} />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <LooksOne />
                </ListItemIcon>
                <ListItemText primary="Heading 1" />
                <ListItemSecondaryAction>
                  <Chip label={HotkeysUtils.Heading1} />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <LooksTwo />
                </ListItemIcon>
                <ListItemText primary="Heading 2" />
                <ListItemSecondaryAction>
                  <Chip label={HotkeysUtils.Heading2} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <br />
            <Typography variant="overline">Miscellaneous</Typography>
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Undo />
                </ListItemIcon>
                <ListItemText primary="Undo" />
                <Chip label={HotkeysUtils.Undo} />
              </ListItem>
              <ListItem>
                <ListItemIcon style={{ minWidth: 40 }}>
                  <Redo />
                </ListItemIcon>
                <ListItemText primary="Redo" />
                <Chip label={HotkeysUtils.Redo} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
