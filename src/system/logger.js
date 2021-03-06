const fs = require('fs');
const winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');
const config = require('@root/src/config');

// log directory
const varDir = `${__dirname}/../../var`;
const logDir = `${varDir}/logs`;
if (!fs.existsSync(varDir)) fs.mkdirSync(varDir);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const handler = {};

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
    error: config.logger.LOG_COLOR_ERROR,
    warn: config.logger.LOG_COLOR_WARN,
    info: config.logger.LOG_COLOR_INFO,
    sql: config.logger.LOG_COLOR_SQL,
    system: config.logger.LOG_COLOR_SYSTEM,
    debug: config.logger.LOG_COLOR_DEBUG,
    silly: config.logger.LOG_COLOR_SILLY,
  },
};

handler.logger = winston.createLogger({
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
      maxFiles: config.logger.LOG_INFO_SAVED_UNTIL, // Days saved
      json: false,
      zippedArchive: true,
      colorize: true,
    }),
    new WinstonDaily({
      level: 'sql',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`, // log file /logs/info/*.log in save
      filename: '%DATE%.log',
      maxFiles: config.logger.LOG_INFO_SAVED_UNTIL, // Days saved
      json: false,
      zippedArchive: true,
      colorize: true,
    }),
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // log file /logs/error/*.log in save
      filename: '%DATE%.error.log',
      maxFiles: config.logger.LOG_ERROR_SAVED_UNTIL, // Days saved
      handleExceptions: true,
      json: true,
      zippedArchive: true,
    }),
    new WinstonDaily({
      level: 'system',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`, // log file /logs/info/*.log in save
      filename: '%DATE%.log',
      maxFiles: config.logger.LOG_SYSTEM_SAVED_UNTIL, // Days saved
      handleExceptions: true,
      json: true,
      zippedArchive: true,
    }),
  ],
});

// colors https://www.npmjs.com/package/colors
winston.addColors(logLevels.colors);

handler.logger.add(
  new winston.transports.Console({
    format: combine(
      winston.format.colorize(),
      logFormat,
    ),
    level: 'silly' }),
);

handler.stream = {
  write: (message) => {
    handler.logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

handler.logger.dev = message => {
  // eslint-disable-next-line no-console
  if (config.env.NODE_ENV === 'development') console.log(message);
};

handler.logger.devError = message => {
  // eslint-disable-next-line no-console
  if (config.env.NODE_ENV === 'development') console.error(message);
};

module.exports = handler;
