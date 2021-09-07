import * as winston from 'winston';
import { envConfig } from './envConfig';

const logger = winston.createLogger({
  level: envConfig.WINSTON_FILE_LEVEL,
  format: winston.format.json(),
});

if (envConfig.NODE_ENV !== 'production' && envConfig.WINSTON_CONSOLE_LEVEL) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    level: envConfig.WINSTON_CONSOLE_LEVEL,
  }));
}

if (envConfig.WINSTON_FILE_LEVEL) {
  logger.add(
    new winston.transports.File({
      filename: `${__dirname}/../../log/debug.log`,
      format: winston.format.combine(
        winston.format.simple(),
      ),
      level: envConfig.WINSTON_FILE_LEVEL,
    }),
  );
}

export default logger;
