/*
 * Modules
 */
require('dotenv').config();
require('module-alias/register');
const AuthService = require('@services/AuthService');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const ejsLocals = require('ejs-locals');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const corsConfig = require('@middleware/CORS');
const systemLogger = require('@middleware/Logger');
const { logger } = require('@system/logger');
const systemMessage = require('@system/message');
const passportConfig = require('@controllers/auth/passport');

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
app.use(express.json({
  limit: '50mb',
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(helmet({
  contentSecurityPolicy: false,
}));
passportConfig();

/*
 * Middleware
 */

// CORS
app.use(cors(corsConfig[process.env.NODE_ENV]));

// logger
app.use(systemLogger[process.env.NODE_ENV]);

// session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    path: './var/session',
    ttl: process.env.SESSION_TTL,
  }),
}));

// robot.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
    'User-agent: *\nDisallow: /',
  );
});

// redirect https
app.all('*', (req, res, next) => {
  // redirect HTTP to HTTPS
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    next();
  } else {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    if (protocol === 'https') {
      next();
    } else {
      const from = `${protocol}://${req.hostname}${req.url}`;
      const to = `https://'${req.hostname}${req.url}`;

      // log and redirect
      console.log(`[${req.method}]: ${from} -> ${to}`);
      res.redirect(to);
    }
  }
});

// Auth middleware
app.use(async (req, res, next) => {
  // not require jwt verification url list
  const allowedUrlPatterns = [
    /^\/$/,
    /\/auth\/(\w)*$/i,
    /^\/docs$/i,
    /^\/api_history$/i,
    /^\/insomnia.json$/i,
    /^\/robots.txt$/i,
    /^\/session$/i,
    /^\/session\/[0-9a-z]*$/i,
    /^\/expired$/i,
    /^\/mail$/i,
  ];

  for (let i = 0, l = allowedUrlPatterns.length; i < l; i += 1) {
    if (allowedUrlPatterns[i].exec(req.path) !== null) return next();
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
const error = require('@middleware/Error');

app.use(error.notFoundError);
app.use(error.errorMessage);

logger.system(`🚀 ${process.env.APP_NAME} is ready on ${process.env.PORT}`);

/*
 * Global
 */
global.logger = logger;
global.message = systemMessage;

module.exports = app;
