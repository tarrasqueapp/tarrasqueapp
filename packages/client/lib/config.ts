function getEnvironmentVariable(environmentVariable: string): string {
  return process.env[environmentVariable] || '';
}

export const config = {
  BASE_PATH: getEnvironmentVariable('BASE_PATH'),
  PORT: parseInt(getEnvironmentVariable('PORT'), 10),
  TUS_URL: getEnvironmentVariable('TUS_URL'),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: getEnvironmentVariable('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
};
