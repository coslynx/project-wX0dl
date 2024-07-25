const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { colorize } = require('winston/lib/winston/format');
const { constants } = require('./constants.js');

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    label({ label: 'Discord Music Bot' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      format: combine(
        colorize({ all: true }),
        timestamp(),
        myFormat
      ),
    }),
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = { logger };