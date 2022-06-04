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
  nodeEnv: z.string().min(1),
  verbose: z.boolean(),
  port: z.number().min(1),
  cookieSecret: z.string().min(1),
  jwtAccessTokenName: z.string().min(1),
  jwtAccessTokenSecret: z.string().min(1),
  jwtAccessTokenExpirationTime: z.string().min(1),
  jwtRefreshTokenName: z.string().min(1),
  jwtRefreshTokenSecret: z.string().min(1),
  jwtRefreshTokenExpirationTime: z.string().min(1),
});
type Schema = z.infer<typeof schema>;

export const config: Schema = {
  basePath: getEnvironmentVariable('BASE_PATH'),
  nodeEnv: getEnvironmentVariable('NODE_ENV'),
  verbose: getEnvironmentVariable('VERBOSE') === 'true',
  port: parseInt(getEnvironmentVariable('PORT'), 10),
  cookieSecret: getEnvironmentVariable('COOKIE_SECRET'),
  jwtAccessTokenName: getEnvironmentVariable('JWT_ACCESS_TOKEN'),
  jwtAccessTokenSecret: getEnvironmentVariable('JWT_ACCESS_TOKEN_SECRET'),
  jwtAccessTokenExpirationTime: getEnvironmentVariable('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
  jwtRefreshTokenName: getEnvironmentVariable('JWT_REFRESH_TOKEN'),
  jwtRefreshTokenSecret: getEnvironmentVariable('JWT_REFRESH_TOKEN_SECRET'),
  jwtRefreshTokenExpirationTime: getEnvironmentVariable('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
};

schema.parse(config);
