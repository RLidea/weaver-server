/*
 * Modules
 */
require('dotenv').config();
require('module-alias/register');
const AuthService = require('@services/AuthService');

const express = require('express');
// const middleware = require('./app/middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const ejsLocals = require('ejs-locals');
const passportConfig = require('./app/controllers/auth/passport');

/*
 * Environment Configurations
 */
const app = express();

/*
 * View Engine Setup
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsLocals);

/*
 * Express Configurations
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
passportConfig();
app.use(cors(require('./app/middleware/CORS')));

/*
 * Middleware
 */

// logger
const logger = require('./app/middleware/Logger');

app.use(logger.printTerminalDev);
app.use(process.env.NODE_ENV === 'development' ? logger.saveFileDev : logger.saveFileDefault);

// Auth middleware
app.use(async (req, res, next) => {
  // not require jwt verification
  const allowedUrls = [
    '/',
    '/auth/login',
    '/auth/register',
    '/docs',
    '/api_history',
    '/insomnia.json',
    '/auth/reset/password',
  ];

  for (let i = 0, l = allowedUrls.length; i < l; i += 1) {
    if (req.path === allowedUrls[i]) return next();
  }

  const loginInfo = AuthService.getLoginInfo(req);
  if (!loginInfo.isLogin) {
    return res.status(401).json({ message: 'access denied' });
  }
  next();
});

/*
 * Routers
 */
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

/*
 * Error
 */
const error = require('./app/middleware/Error');

app.use(error.notFoundError);
app.use(error.errorMessage);

console.log(`[System] ${process.env.APP_NAME} is ready`);

module.exports = app;
