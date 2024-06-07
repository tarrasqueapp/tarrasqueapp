import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Backdrop, Box, Button, SvgIcon, Typography, keyframes } from '@mui/material';
import { useEffect, useState } from 'react';

import d4Icon from '@/public/images/app-icons/d4.svg';
import d6Icon from '@/public/images/app-icons/d6.svg';
import d8Icon from '@/public/images/app-icons/d8.svg';
import d10Icon from '@/public/images/app-icons/d10.svg';
import d12Icon from '@/public/images/app-icons/d12.svg';
import d20Icon from '@/public/images/app-icons/d20.svg';
import { useDiceStore } from '@/store/useDiceStore';
import { Color } from '@/utils/colors';

const rollInBottom = keyframes`
  0% {
    transform: translateY(0) rotate(1440deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
`;

const bounceInBottom = keyframes`
  0% {
    transform: translateY(-500px);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    transform: translateY(0);
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    transform: translateY(-65px);
    animation-timing-function: ease-in;
  }
  72% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
  81% {
    transform: translateY(-38px);
    animation-timing-function: ease-in;
  }
  90% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
  95% {
    transform: translateY(-8px);
    animation-timing-function: ease-in;
  }
  100% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
`;

export function DiceRollerBackdrop() {
  const [roll, setRoll] = useState<DiceRoll | null>(null);

  const rolling = useDiceStore((state) => state.rolling);
  const setRolling = useDiceStore((state) => state.setRolling);
  const notation = useDiceStore((state) => state.notation);
  const getNumberOfFaces = useDiceStore((state) => state.getNumberOfFaces);
  const backdropVisible = useDiceStore((state) => state.backdropVisible);
  const setBackdropVisible = useDiceStore((state) => state.setBackdropVisible);

  // Listen to dice roll changes and roll the dice
  useEffect(() => {
    if (!rolling) return;

    const stopRolling = setTimeout(() => {
      setRolling(false);
    }, 975);

    const roll = new DiceRoll(notation);
    setRoll(roll);

    return () => {
      clearTimeout(stopRolling);
    };
  }, [rolling, notation]);

  /**
   * Reroll previous notation
   * @param event - The click event
   */
  function handleReroll(event: React.MouseEvent) {
    event.stopPropagation();
    setRolling(true);
  }

  const numberOfFaces = getNumberOfFaces();

  return (
    <Backdrop
      onClick={() => setBackdropVisible(false)}
      open={backdropVisible}
      sx={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: Color.WHITE_LIGHT,
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={
          rolling
            ? {
                animation: `${bounceInBottom} 1000ms ease-out infinite`,
                '& svg': {
                  animation: `${rollInBottom} 1000ms ease-out infinite`,
                },
              }
            : undefined
        }
      >
        {numberOfFaces === 4 && <SvgIcon component={d4Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 6 && <SvgIcon component={d6Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 8 && <SvgIcon component={d8Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 10 && <SvgIcon component={d10Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 12 && <SvgIcon component={d12Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 20 && <SvgIcon component={d20Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 100 && <SvgIcon component={d10Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}
        {numberOfFaces === 100 && <SvgIcon component={d10Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />}

        {![4, 6, 8, 10, 12, 20, 100].includes(numberOfFaces) && (
          <SvgIcon component={d20Icon} sx={{ fontSize: '8rem', marginBottom: 4 }} />
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h2" style={{ wordBreak: 'break-all', margin: '0 auto' }}>
          {roll?.notation}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Button color="primary" variant="contained" onClick={handleReroll}>
          Reroll
        </Button>

        {/* {roll && (
          <Button color="secondary" variant="contained" onClick={() => {}} style={{ marginLeft: 8 }}>
            Share In Chat
          </Button>
        )} */}
      </Box>

      <Typography style={{ fontSize: 96 }}>{roll && !rolling ? roll.total : '\u00A0'}</Typography>

      <Typography variant="caption">{(roll && !rolling && roll.output) || '\u00A0'}</Typography>
    </Backdrop>
  );
}
