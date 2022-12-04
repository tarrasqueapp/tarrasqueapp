export const config = {
  HOST: process.env.HOST || '',
  NODE_ENV: process.env.NODE_ENV || '',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '',
  SENTRY_ENABLED: Boolean(process.env.SENTRY_ENABLED) || false,
  SENTRY_DSN: process.env.SENTRY_DSN || '',
};
