/* eslint-disable no-process-env */

// Env vars should be casted to correct types
const config = {
  PORT: Number(process.env.PORT) || 9000,
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.LOCAL_HOST || "127.0.0.1",
  LOG_LEVEL: process.env.LOG_LEVEL,
  ALLOW_HTTP: true,
  // ALLOW_HTTP: process.env.ALLOW_HTTP === 'true',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  API_TOKENS: [],
  IS_LINUX: process.env.IS_LINUX === 'true',
  CORS_ORIGIN: "*",
};

if (process.env.API_TOKENS) {
  config.API_TOKENS = process.env.API_TOKENS.split(',');
}

module.exports = config;
