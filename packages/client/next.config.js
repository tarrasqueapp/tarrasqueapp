/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Global
    VERSION: process.env.VERSION,
    // URL
    HOST: process.env.HOST,
    // Authentication
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
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
