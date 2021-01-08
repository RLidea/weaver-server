const fs = require('fs');

const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

// log directory
const varDir = `${__dirname}/../../../var`;
const logDir = `${varDir}/logs`;
if (!fs.existsSync(varDir)) fs.mkdirSync(varDir);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// winston format
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf((
  {
    // eslint-disable-next-line no-shadow
    timestamp,
    level,
    message,
  },
) => `[${timestamp}] ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // info log setting
    // eslint-disable-next-line new-cap
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`, // log file /logs/info/*.log in save
      filename: '%DATE%.log',
      maxFiles: 14, // Days saved
      json: false,
      zippedArchive: true,
      colorize: true,
    }),
    // error log setting
    // eslint-disable-next-line new-cap
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // log file /logs/error/*.log in save
      filename: '%DATE%.error.log',
      maxFiles: 14, // Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      // winston.format.colorize(),
      // winston.format.simple(),
    ),
  }),
);

const stream = {
  write: (message) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

module.exports = { logger, stream };
