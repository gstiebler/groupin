import * as winston from 'winston';

const logger = winston.createLogger({
  level: process.env.WINSTON_FILE_LEVEL,
  format: winston.format.json(),
  /* transports: [
    new winston.transports.File({ filename: `${__dirname}/../../log/debug.log`, level: 'debug' }),
  ] */
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    level: process.env.WINSTON_CONSOLE_LEVEL,
  }));
}

if (process.env.WINSTON_FILE_LEVEL) {
  logger.add(
    new winston.transports.File({
      filename: `${__dirname}/../../log/debug.log`,
      format: winston.format.combine(
        winston.format.simple(),
      ),
      level: process.env.WINSTON_FILE_LEVEL,
    }),
  );
}

export default logger;
