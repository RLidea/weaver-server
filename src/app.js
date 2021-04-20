/* eslint global-require: 0 */
/*
 * Modules
 */
require('dotenv').config();
require('module-alias/register');

const express = require('express');

const {
  expressLoader,
  corsLoader,
  allowedUrlLoader,
  errorLoader,
} = require('@middleware/index');
const { logger } = require('@system/logger');
const message = require('@system/message');

/*
 * Environment Configurations
 */
const app = express();

expressLoader(app);
corsLoader(app);
allowedUrlLoader(app);

/*
 * Routers
 */
try {
  app.use('/', require('./routes/index'));
  app.use('/auth', require('./routes/auth'));
  app.use('/v1/auth', require('./routes/v1/auth'));
} catch (e) {
  logger.devError(e);
}

errorLoader(app);

logger.system(`🚀 ${process.env.APP_NAME} is ready on ${process.env.PORT}`);

/*
 * Global
 */
global.logger = logger;
global.message = message;
global.env = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

module.exports = app;
