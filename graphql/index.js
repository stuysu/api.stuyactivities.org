const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		return {
			session: req.session
		};
	}
});

module.exports = apolloServer;
