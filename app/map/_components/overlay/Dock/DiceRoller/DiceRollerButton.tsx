import { SvgIcon, Tooltip } from '@mui/material';

import d20Icon from '@/public/images/app-icons/d20.svg';
import { NativeDraggable, useDraggableStore } from '@/store/draggable';

import { DockButton } from '../DockButton';

export function DiceRollerButton() {
  const draggable = useDraggableStore((state) => state.draggables[NativeDraggable.DICE_ROLLER]);
  const toggleVisibility = useDraggableStore((state) => state.toggleVisibility);

  /**
   * Toggle the dice roller window visibility
   */
  function handleToggle() {
    toggleVisibility(NativeDraggable.DICE_ROLLER);
  }

  return (
    <Tooltip title="Dice Roller">
      <DockButton onClick={handleToggle} active={draggable?.visible}>
        <SvgIcon component={d20Icon} sx={{ fontSize: '2rem' }} />
      </DockButton>
    </Tooltip>
  );
}
