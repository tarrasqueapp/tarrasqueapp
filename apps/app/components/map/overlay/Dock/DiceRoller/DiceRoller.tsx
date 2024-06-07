import { DiceRollerBackdrop } from './DiceRollerBackdrop';
import { DiceRollerButton } from './DiceRollerButton';
import { DiceRollerWindow } from './DiceRollerWindow';

export function DiceRoller() {
  return (
    <>
      <DiceRollerButton />
      <DiceRollerWindow />
      <DiceRollerBackdrop />
    </>
  );
}
