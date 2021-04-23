import honeybadger from './middleware/honeybadger';
import express from 'express';

// The app is served behind a cloudflare proxy
// This is so our app doesn't think legitimate requests are fraudulent
import proxyValidator from './middleware/proxyValidator';

import cors from './middleware/cors';
import session from './middleware/session';
import apolloSessionValidators from './middleware/apolloSessionValidators';
import parsers from './middleware/parsers';
import apolloServer from './graphql';
import serverErrorHandler from './middleware/serverErrorHandler';
import logger from './middleware/logger';
import graphqlUploads from './middleware/graphqlUploads';
import './googleApis/gmailWatcher';
import './utils/createRecurringMeetings';
import syncUsers from './stuyboe/syncUsers';

const app = express();

app.use(honeybadger.requestHandler);

app.use(logger);

app.set('trust proxy', proxyValidator);

app.use(cors);

app.use(session);

app.use(apolloSessionValidators);

app.use(parsers);

app.get('/stuyboe/syncUsers', syncUsers);

app.use(graphqlUploads);

apolloServer.applyMiddleware({ app, path: '/graphql', cors: false });

app.use(honeybadger.errorHandler);

app.use(serverErrorHandler);

export default app;

process.on('uncaughtException', function (error) {
	honeybadger.notify(error);
	console.error(error);
});
