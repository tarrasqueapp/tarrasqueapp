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
  basePath: z.string(),
  port: z.number().min(1),
  tusUrl: z.string().min(1),
  jwtAccessTokenExpirationTime: z.string().min(1),
});
type Schema = z.infer<typeof schema>;

export const config: Schema = {
  basePath: getEnvironmentVariable('BASE_PATH'),
  port: parseInt(getEnvironmentVariable('PORT'), 10),
  tusUrl: getEnvironmentVariable('TUS_URL'),
  jwtAccessTokenExpirationTime: getEnvironmentVariable('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
};

schema.parse(config);
