/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  env: {
    // URL
    HOST: process.env.HOST,
    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.SUPABASE_PROTOCOL,
        hostname: process.env.SUPABASE_HOST,
        port: process.env.SUPABASE_PORT,
        pathname: '/storage/v1/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
