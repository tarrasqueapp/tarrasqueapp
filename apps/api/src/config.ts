import packageJson from '../package.json';

export const config = {
  // Global
  VERSION: packageJson.version,
  HOST: process.env.HOST || 'http://localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '14d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || '',
  // Storage
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'local',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  AWS_S3_URL: process.env.AWS_S3_URL || '',
  // PostgreSQL
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://tarrasque:tarrasque@postgres:5432/tarrasque?schema=public',
  // Email
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  SMTP_USERNAME: process.env.SMTP_USERNAME || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
};
