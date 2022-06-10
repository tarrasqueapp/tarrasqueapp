import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  enabled: process.env.SENTRY_ENABLED && process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new BrowserTracing()],
});
