import packageJson from '../package.json';

export const config = {
  VERSION: packageJson.version,
  HOST: process.env.HOST ?? 'http://localhost',
  AXIOS_BASE_URL: process.env.AXIOS_BASE_URL || 'http://turbo:3001',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? '5m',
};
