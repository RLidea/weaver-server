/* eslint global-require: 0 */
/* eslint no-console: 0 */
/*
 * Modules
 */
require('module-alias/register');
const express = require('express');
const config = require('@root/src/config');
const loader = require('@middleware/index');
const router = require('@root/src/routes/router');

try {
  const { logger } = require('@system/logger');
  const message = require('@system/message');

  /*
   * Global
   */
  global.logger = logger;
  global.message = message;
  global.config = config;
  loader.configValidation(config, {
    not_required: [
      'KAKAO_JS_APP_KEY',
      'KAKAO_CLIENT_SECRET',
      'NAVER_CLIENT_ID',
      'NAVER_CLIENT_SECRET',
      'MAIL_DEV_USER',
      'MAIL_DEV_PASSWORD',
      'MAIL_USER',
      'MAIL_PASSWORD',
    ],
  });

  /*
   * Environment Configurations
   */
  const app = express();

  loader.express(app);
  loader.cors(app);
  loader.csrf(app);
  loader.allowedUrl(app);

  /*
   * Routers
   */
  router(app);
  loader.error(app);

  logger.system(`🚀 ${config.env.APP_NAME} is ready on ${config.env.PORT}`);

  module.exports = app;
} catch (e) {
  console.error(e);
  if (e.message.includes('Dialect needs to be explicitly supplied')) {
    console.log('⚠️ Check your .env file');
  }
}
