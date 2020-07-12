const { ApolloServer, ApolloError } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const honeybadger = require('honeybadger');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		return {
			session: req.session
		};
	},
	introspection: true,
	playground: {
		settings: {
			'request.credentials': 'same-origin'
		}
	},
	formatError: err => {
		const intentionalError = err.originalError instanceof ApolloError;

		// This is an unexpected error and might have secrets
		if (!intentionalError) {
			console.error(err.originalError);

			// report this error to us but hide it from the client
			honeybadger.notify(err);
			return new Error('There was an unknown error on the server');
		}

		return err;
	}
});

module.exports = apolloServer;
