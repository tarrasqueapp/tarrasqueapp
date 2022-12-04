import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';

import { config } from './lib/config';

Sentry.init({
  enabled: config.SENTRY_ENABLED && config.NODE_ENV === 'production',
  dsn: config.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new BrowserTracing()],
});
