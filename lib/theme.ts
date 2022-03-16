import { createTheme } from '@mui/material/styles';

import { Color } from './enums';

export const theme = createTheme({
  palette: {
    primary: {
      main: Color.Brown,
    },
    secondary: {
      main: Color.Gold,
    },
    error: {
      main: Color.Red,
    },
  },
});
