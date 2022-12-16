const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Global
    VERSION: process.env.VERSION,
    // URL
    HOST: process.env.HOST,
    LANDING_URL: process.env.LANDING_URL,
    // Authentication
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    // Sentry
    SENTRY_ENABLED: process.env.SENTRY_ENABLED,
    SENTRY_DSN: process.env.SENTRY_DSN,
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

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
