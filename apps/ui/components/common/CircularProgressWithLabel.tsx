import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material';

export const CircularProgressWithLabel: React.FC<CircularProgressProps & { value: number }> = (props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" size={60} {...props} />

      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};
