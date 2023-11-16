/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // URL
    HOST: process.env.HOST,
    API_BASE_URL: process.env.API_BASE_URL,
    // Authentication
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
  transpilePackages: ['@tarrasque/common', '@tarrasque/sdk'],
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
