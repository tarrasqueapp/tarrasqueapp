export const config = {
  VERSION: process.env.VERSION ?? '',
  HOST: process.env.HOST ?? 'http://localhost',
  LANDING_URL: process.env.LANDING_URL ?? 'https://tarrasque.app',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? '5m',
  SENTRY_ENABLED: process.env.SENTRY_ENABLED === 'true',
  SENTRY_DSN: process.env.SENTRY_DSN ?? '',
};
