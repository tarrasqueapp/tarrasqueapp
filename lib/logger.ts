import { createConsola } from 'consola';

import { config } from './config';

export const logger = createConsola({
  level: config.NODE_ENV === 'production' ? 3 : 4,
});
