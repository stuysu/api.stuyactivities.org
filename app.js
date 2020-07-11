const express = require('express');
const app = express();

const logger = require('./middleware/logger');
app.use(logger);

const session = require('./middleware/session');
app.use(session);

const parsers = require('./middleware/parsers');
app.use(parsers);

const opengraph = require('./opengraph');
app.use(opengraph);

const routes = require('./routes');
app.use(routes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
