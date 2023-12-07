import packageJson from '../../../package.json';

export const config = {
  // Global
  VERSION: packageJson.version,
  HOST: process.env.HOST || 'http://localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
};
