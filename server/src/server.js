require('dotenv').config();
const express = require('express');
const app = express();
const index = require('../index');
const logger = require('./config/winston');
const mongooseConfig = require('./config/mongoose');

mongooseConfig.init();

app.post('/graphql', index.main);

app.listen(process.env.PORT);

logger.info(`Express server listening on port ${process.env.PORT}`);
