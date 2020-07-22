const { gql } = require('apollo-server-express');

module.exports = gql`
	input StdLoginParams {
		email: String!
		password: String!
	}

	type Mutation {
		login(credentials: StdLoginParams, googleToken: String): User!
		requestPasswordReset(email: String!): Boolean
		usePasswordResetToken(token: String!, password: String!): Boolean
		logout: Boolean
	}
`;
