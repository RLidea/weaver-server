/*
 * Modules
 */
require('dotenv').config();
require('module-alias/register');

const express = require('express');
// const middleware = require('./app/middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const csrf = require('csurf');
const cors = require('cors');
const ejsLocals = require('ejs-locals');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const i18nextFsBackend = require('i18next-node-fs-backend');
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

// i18next
i18next
  .use(i18nextFsBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: `${__dirname}/locales/{{lng}}.json`,
      addPath: `${__dirname}/locales/{{lng}}.missing.json`,
    },
    fallbackLng: 'en',
    preload: ['en', 'ko'],
    saveMissing: true,
  });
app.use(i18nextMiddleware.handle(i18next));

app.all('*', (req, res, next) => {
  // set locale

  // Routing
  const rxLocal = /^\/(ko|en)/i;
  if (rxLocal.test(req.url)) {
    const arr = rxLocal.exec(req.url);
    const local = arr[1];
    req.i18n.changeLanguage(local);
  } else {
    req.i18n.changeLanguage('en');
  }

  // Query String
  const { lng } = req.query;
  if (typeof lng !== 'undefined') {
    req.i18n.changeLanguage(lng);
  }

  next();
});

/*
 * Routers
 */

app.use(csrf({
  cookie: {
    key: '_csrf-token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // 1-hour
  },
}));

app.use('/api', require('./routes/apis'));

app.use('/', require('./routes/index'));
// app.use('/:lng', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));

/*
 * Error
 */
const error = require('./app/middleware/Error');

app.use(error.notFoundError);
app.use(error.errorMessage);

console.log(`[System] ${process.env.APP_NAME} is ready`);

module.exports = app;
