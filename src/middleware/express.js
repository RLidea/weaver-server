/*
  Express Loader
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const ejsLocals = require('ejs-locals');
const morgan = require('morgan');
const passport = require('passport');
const passportConfig = require('@controllers/auth/passport');

const { stream, logger } = require('@system/logger');

module.exports = async (app) => {
  try {
    /*
    helmet
   */
    app.use(helmet({
      contentSecurityPolicy: false,
    }));

    /*
     * View Engine Setup
     */
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
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
    app.use(express.static(path.join(__dirname, '../public')));

    /*
     * robot.txt
     */
    app.get('/robots.txt', (req, res) => {
      res.type('text/plain');
      res.send(
        'User-agent: *\nDisallow: /',
      );
    });

    /*
     * redirect https
     */
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
          // eslint-disable-next-line no-console
          console.log(`[${req.method}]: ${from} -> ${to}`);
          res.redirect(to);
        }
      }
    });

    /*
      passport
     */
    app.use(passport.initialize({}));
    passportConfig();

    /*
      system logger
     */
    const systemLogger = {
      development: morgan('dev', { stream }),
      production: morgan('combined', { stream }),
    };
    app.use(systemLogger[process.env.NODE_ENV]);
  } catch (e) {
    logger.devError('🔴 /src/middleware/express.js');
    logger.devError(e);
  }
};
