/*
 * Modules
 */
require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
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

/*
 * Error Handler
 */

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'production' ? { status: err.status } : err;

  console.log('[system] An error has occurred from client');
  console.log(res.locals.error);

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: '::' + err.status,
  });
});

module.exports = app;
