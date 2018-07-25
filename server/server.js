require('dotenv').config();
const express = require('express');
const app = express();
const index = require('./index');

app.post('/message', index.postMessage);

app.listen(process.env.PORT);
