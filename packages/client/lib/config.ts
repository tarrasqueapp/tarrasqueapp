export const config = {
  BASE_PATH: process.env.BASE_PATH || '',
  PORT: parseInt(process.env.PORT || '', 10),
  TUS_URL: process.env.TUS_URL || '',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '',
};
