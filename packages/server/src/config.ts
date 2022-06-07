function getEnvironmentVariable(environmentVariable: string): string {
  return process.env[environmentVariable] || '';
}

export const config = {
  BASE_PATH: getEnvironmentVariable('BASE_PATH'),
  DOMAIN_FULL: getEnvironmentVariable('DOMAIN_FULL'),
  NODE_ENV: getEnvironmentVariable('NODE_ENV'),
  VERBOSE: getEnvironmentVariable('VERBOSE') === 'true',
  PORT: parseInt(getEnvironmentVariable('PORT'), 10),
  COOKIE_SECRET: getEnvironmentVariable('COOKIE_SECRET'),
  JWT_ACCESS_TOKEN_NAME: getEnvironmentVariable('JWT_ACCESS_TOKEN_NAME'),
  JWT_ACCESS_TOKEN_SECRET: getEnvironmentVariable('JWT_ACCESS_TOKEN_SECRET'),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: getEnvironmentVariable('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
  JWT_REFRESH_TOKEN_NAME: getEnvironmentVariable('JWT_REFRESH_TOKEN_NAME'),
  JWT_REFRESH_TOKEN_SECRET: getEnvironmentVariable('JWT_REFRESH_TOKEN_SECRET'),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: getEnvironmentVariable('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
  STORAGE_PROVIDER: getEnvironmentVariable('STORAGE_PROVIDER'),
  STORAGE_S3_BUCKET: getEnvironmentVariable('STORAGE_S3_BUCKET'),
  STORAGE_S3_ACCESS_KEY_ID: getEnvironmentVariable('STORAGE_S3_ACCESS_KEY_ID'),
  STORAGE_S3_SECRET_ACCESS_KEY: getEnvironmentVariable('STORAGE_S3_SECRET_ACCESS_KEY'),
  STORAGE_S3_REGION: getEnvironmentVariable('STORAGE_S3_REGION'),
  STORAGE_S3_ENDPOINT: getEnvironmentVariable('STORAGE_S3_ENDPOINT'),
  STORAGE_S3_URL: getEnvironmentVariable('STORAGE_S3_URL'),
};
