import { Add } from '@mui/icons-material';
import { Button, Paper } from '@mui/material';

import { Color } from '../../lib/colors';

export const MapNew: React.FC = () => {
  const borderColor = Color.BrownDark;
  const spacing = '20px';
  const dashLength = '40px';
  const borderWidth = '3px';

  return (
    <Paper
      sx={{
        width: 200,
        height: 200,
        display: 'flex',
        cursor: 'pointer',
        backgroundImage: `repeating-linear-gradient(0deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(90deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(180deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(270deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength})`,
        backgroundSize: `${borderWidth} 100%, 100% ${borderWidth}, ${borderWidth} 100%, 100% ${borderWidth}`,
        backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={() => {}}
    >
      <Button
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 0 auto',
          gap: 1,
        }}
      >
        <Add />
        New Map
      </Button>
    </Paper>
  );
};
