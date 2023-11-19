import createLoadRemoteModule, { createRequires } from '@paciolan/remote-module-loader';

import { TarrasquePlugin } from '@tarrasque/sdk';

const dependencies = {
  react: require('react'),
  'react/jsx-runtime': require('react/jsx-runtime'),
  'react-dom': require('react-dom'),
  '@tarrasque/sdk': require('@tarrasque/sdk'),
  '@mui/material': require('@mui/material'),
  '@mui/icons-material': require('@mui/icons-material'),
};

const requires = createRequires(dependencies);

export const loadPlugin = createLoadRemoteModule({ requires }) as {
  (url: string): Promise<{ default: typeof TarrasquePlugin }>;
};
