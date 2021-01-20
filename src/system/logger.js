const fs = require('fs');
const winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');

// log directory
const varDir = `${__dirname}/../../var`;
const logDir = `${varDir}/logs`;
if (!fs.existsSync(varDir)) fs.mkdirSync(varDir);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const utils = {};

// winston format
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf(info => `[${info.timestamp}] ${info.level} - ${info.message}`);
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    sql: 3,
    system: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: process.env.LOG_COLOR_ERROR,
    warn: process.env.LOG_COLOR_WARN,
    info: process.env.LOG_COLOR_INFO,
    sql: process.env.LOG_COLOR_SQL,
    system: process.env.LOG_COLOR_SYSTEM,
    debug: process.env.LOG_COLOR_DEBUG,
    silly: process.env.LOG_COLOR_SILLY,
  },
};

utils.logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  levels: logLevels.levels,
  transports: [
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`, // log file /logs/info/*.log in save
      filename: '%DATE%.log',
      maxFiles: process.env.LOG_INFO_SAVED_UNTIL, // Days saved
      json: false,
      zippedArchive: true,
      colorize: true,
    }),
    new WinstonDaily({
      level: 'sql',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`, // log file /logs/info/*.log in save
      filename: '%DATE%.log',
      maxFiles: process.env.LOG_INFO_SAVED_UNTIL, // Days saved
      json: false,
      zippedArchive: true,
      colorize: true,
    }),
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // log file /logs/error/*.log in save
      filename: '%DATE%.error.log',
      maxFiles: process.env.LOG_ERROR_SAVED_UNTIL, // Days saved
      handleExceptions: true,
      json: true,
      zippedArchive: true,
    }),
    new WinstonDaily({
      level: 'system',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`, // log file /logs/info/*.log in save
      filename: '%DATE%.log',
      maxFiles: process.env.LOG_SYSTEM_SAVED_UNTIL, // Days saved
      handleExceptions: true,
      json: true,
      zippedArchive: true,
    }),
  ],
});

// colors https://www.npmjs.com/package/colors
winston.addColors(logLevels.colors);

utils.logger.add(
  new winston.transports.Console({
    format: combine(
      winston.format.colorize(),
      logFormat,
    ),
    level: 'silly' }),
);

utils.stream = {
  write: (message) => {
    utils.logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

utils.logger.dev = message => {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV === 'development') console.log(`${message}`);
};

utils.logger.devError = message => {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV === 'development') console.error(`${message}`);
};

module.exports = utils;
