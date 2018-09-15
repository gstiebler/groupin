const winston = require('winston');

let logger = winston.createLogger({
  level: process.env.WINSTON_FILE_LEVEL,
  format: winston.format.json(),
  /*transports: [
    new winston.transports.File({ filename: `${__dirname}/../../log/error.log`, level: 'error' }),
  ]*/
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: process.env.WINSTON_CONSOLE_LEVEL,
  }));
}

module.exports = logger;
