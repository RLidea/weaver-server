/*
 * Modules
 */
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportConfig = require('./app/controllers/auth/passport');
const csrf = require('csurf');
const ejsLocals = require('ejs-locals');

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
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

/*
 * Routers
 */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

/*
 * Middleware
 */

// logger
const logger = require('./app/middleware/logger');
app.use(logger.printTerminalDev);
app.use(process.env.NODE_ENV == 'development' ? logger.saveFileDev : logger.saveFileDefault);

// error
const error = require('./app/middleware/error');
app.use(error.notFoundError);
app.use(error.errorMessage);

module.exports = app;
