/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // URL
    HOST: process.env.HOST,
    AXIOS_BASE_URL: process.env.AXIOS_BASE_URL,
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
