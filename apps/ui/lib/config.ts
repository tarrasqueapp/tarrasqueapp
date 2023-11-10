import packageJson from '../package.json';

export const config = {
  VERSION: packageJson.version,
  HOST: process.env.HOST ?? 'http://localhost',
  API_BASE_URL: process.env.API_BASE_URL || 'http://turbo:3001',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '5m',
};
