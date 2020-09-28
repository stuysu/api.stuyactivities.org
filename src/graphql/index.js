import { createComplexityLimitRule } from 'graphql-validation-complexity';
import {
	ApolloError,
	ApolloServer,
	ValidationError
} from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import honeybadger from 'honeybadger';

const models = require('../database');

const ComplexityLimitRule = createComplexityLimitRule(75000, {
	scalarCost: 1,
	objectCost: 5,
	listFactor: 10
});

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		return {
			session: req.session,
			models,
			ipAddress:
				req.headers['x-forwarded-for'] || req.connection.remoteAddress
		};
	},
	uploads: false,
	introspection: true,
	playground: {
		settings: {
			'request.credentials': 'same-origin'
		}
	},
	validationRules: [ComplexityLimitRule],
	formatError: err => {
		const safeError =
			err.originalError instanceof ApolloError ||
			err instanceof ValidationError ||
			err.originalError.message === 'Not allowed by CORS';

		honeybadger.notify(err, {
			context: {
				originalError: err.originalError
			}
		});

		const internalError =
			err &&
			err.extensions &&
			err.extensions.code &&
			err.extensions.code === 'INTERNAL_SERVER_ERROR';

		// This is an unexpected error and might have secrets
		if (!safeError || internalError) {
			console.error(err.originalError);

			// report this error to us but hide it from the client
			// honeybadger.notify(err.originalError);
			return new Error(
				`There was an unknown error on the server. Rest assured it has been reported. Feel free to contact us at it@stuysu.org to provide more information.`
			);
		}

		// Might want to hide the stack trace for security in production
		if (
			process.env.NODE_ENV === 'production' &&
			err.extensions &&
			err.extensions.exception &&
			err.extensions.exception.stacktrace
		) {
			delete err.extensions.exception.stacktrace;
		}

		return err;
	}
});

export default apolloServer;
