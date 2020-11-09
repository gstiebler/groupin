import winston = require('winston');
import fs = require('fs');
import mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

function createLogger(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: filePath,
        level: 'debug',
        maxsize: 50000000,
        format: winston.format.combine(
          winston.format.simple(),
        ),
      }),
    ],
  });
}

function addMongooseLogger() {
  const mongoDBLogger = createLogger(process.env.MONGODB_LOG_DIR);
  mongoose.set('debug', (coll, method, query, doc /* , options */) => {
    const lengthLimit = 2000;
    if (method === 'ensureIndex') { return; } // skip indexes queries

    // format to make it easier to display the queries in the format accepted by MongoDB
    function formatter(key, value) {
      if (this[key] instanceof ObjectId) {
        return `!*ObjectId('${value}')!*`;
      } if (this[key] instanceof Date) {
        return `!*ISODate('${value}')!*`;
      }
      return value;
    }
    // reduce the query size if too long
    let strQuery = JSON.stringify(query, formatter, 2);
    if (strQuery.length > lengthLimit) {
      strQuery = `${strQuery.substr(0, lengthLimit / 2)}
 **cut ${strQuery.length} ** ${strQuery.slice(-lengthLimit / 2)}`;
    }

    // replace the quotes and the markers from the string
    strQuery = strQuery.replace(/"!\*/g, '').replace(/!\*"/g, '');
    mongoDBLogger.debug(`db.${coll}.${method}( ${strQuery} )`);
    mongoDBLogger.debug(` *** doc: ${JSON.stringify(doc, null, 2)}`);
  });
}

export default addMongooseLogger;
