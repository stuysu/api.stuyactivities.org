const honeybadger = require('./middleware/honeybadger');
const express = require('express');
const app = express();

app.use(honeybadger.requestHandler);

const logger = require('./middleware/logger');
app.use(logger);

// The app is served behind a cloudflare proxy
// This is so our app doesn't think legitimate requests are fraudulent
const proxyValidator = require('./middleware/proxyValidator');
app.set('trust proxy', proxyValidator);

const cors = require('./middleware/cors');
app.use(cors);

const session = require('./middleware/session');
app.use(session);

const apolloSessionValidators = require('./middleware/apolloSessionValidators');
app.use(apolloSessionValidators);

const parsers = require('./middleware/parsers');
app.use(parsers);

const apolloServer = require('./graphql');
apolloServer.applyMiddleware({ app, path: '/graphql', cors: false });

app.use(honeybadger.errorHandler);

const serverErrorHandler = require('./middleware/serverErrorHandler');
app.use(serverErrorHandler);

module.exports = app;
