const honeybadger = require('./middleware/honeybadger');
const express = require('express');
const app = express();

app.use(honeybadger.requestHandler);

const logger = require('./middleware/logger');
app.use(logger);

const session = require('./middleware/session');
app.use(session);

const parsers = require('./middleware/parsers');
app.use(parsers);

const apolloServer = require('./graphql');
apolloServer.applyMiddleware({ app, path: '/graphql' });

app.use(honeybadger.errorHandler);

module.exports = app;
