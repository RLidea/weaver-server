/* eslint global-require: 0 */
/* eslint no-console: 0 */
/*
 * Modules
 */
try {
  require('dotenv').config();
  require('module-alias/register');
  const config = require('@root/src/config');

  const express = require('express');

  const {
    expressLoader,
    corsLoader,
    csrfLoader,
    allowedUrlLoader,
    errorLoader,
    configValidation,
  } = require('@middleware/index');
  const { logger } = require('@system/logger');
  const message = require('@system/message');

  /*
   * Global
   */
  global.logger = logger;
  global.message = message;
  global.config = config;
  configValidation(config, {
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

  expressLoader(app);
  corsLoader(app);
  csrfLoader(app);
  allowedUrlLoader(app);

  /*
   * Routers
   */
  app.use('/', require('./routes/index'));
  app.use('/auth', require('./routes/auth'));
  app.use('/users', require('./routes/user'));

  errorLoader(app);

  logger.system(`🚀 ${config.env.APP_NAME} is ready on ${config.env.PORT}`);

  module.exports = app;
} catch (e) {
  console.error(e);
  if (e.message.includes('Dialect needs to be explicitly supplied')) {
    console.log('⚠️ Check your .env file');
  }
}
