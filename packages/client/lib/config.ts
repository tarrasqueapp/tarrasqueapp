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
  PORT: z.number().min(1),
  TUS_URL: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: z.string().min(1),
});
type Schema = z.infer<typeof schema>;

export const config: Schema = {
  BASE_PATH: getEnvironmentVariable('BASE_PATH'),
  PORT: parseInt(getEnvironmentVariable('PORT'), 10),
  TUS_URL: getEnvironmentVariable('TUS_URL'),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: getEnvironmentVariable('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
};

schema.parse(config);
