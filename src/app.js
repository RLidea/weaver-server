/* eslint global-require: 0 */
/*
 * Modules
 */
require('dotenv').config();
require('module-alias/register');
const config = require('@root/src/config');

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
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

errorLoader(app);

logger.system(`🚀 ${config.env.APP_NAME} is ready on ${config.env.PORT}`);

/*
 * Global
 */
global.logger = logger;
global.message = message;
global.env = {
  JWT_SECRET_KEY: config.secret.JWT_SECRET_KEY,
};

module.exports = app;
