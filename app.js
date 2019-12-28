/*
 * Modules
 */
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportConfig = require('./app/controllers/auth/passport');
/*
 * Environment Configurations
 */
const app = express();

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

/*
 * Routers
 */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

module.exports = app;
