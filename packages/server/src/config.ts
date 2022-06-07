import { z } from 'zod';

function getEnvironmentVariable(environmentVariable: string): string {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
  } else {
    return unvalidatedEnvironmentVariable;
  }
}

const schema = z.object({
  BASE_PATH: z.string(),
  NODE_ENV: z.string().min(1),
  VERBOSE: z.boolean(),
  PORT: z.number().min(1),
  COOKIE_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_NAME: z.string().min(1),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: z.string().min(1),
  JWT_REFRESH_TOKEN_NAME: z.string().min(1),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: z.string().min(1),
});
type Schema = z.infer<typeof schema>;

export const config: Schema = {
  BASE_PATH: getEnvironmentVariable('BASE_PATH'),
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
};

schema.parse(config);
