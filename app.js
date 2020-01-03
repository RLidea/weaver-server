/*
 * Modules
 */
require('dotenv').config();

const express = require('express');
// const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportConfig = require('./app/controllers/auth/passport');
const csrf = require('csurf');
const fs = require('fs');

/*
 * Environment Configurations
 */
const app = express();

/*
 * View Engine Setup
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
 * Express Configurations
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
passportConfig();
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

/*
 * Logger
 */
if (process.env.NODE_ENV == 'development') {
  app.use(
    logger({
      format: 'dev',
      stream: fs.createWriteStream('app.log', { flags: 'w' }),
    }),
  );
} else {
  app.use(
    logger({
      format: 'default',
      stream: fs.createWriteStream('app.log', { flags: 'w' }),
    }),
  );
}

/*
 * Routers
 */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

module.exports = app;
