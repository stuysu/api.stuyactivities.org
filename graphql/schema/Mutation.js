const { gql } = require('apollo-server-express');

module.exports = gql`
	input StdLoginParams {
		email: String!
		password: String!
	}

	input LoginTypes {
		credentials: StdLoginParams
		googleOAuthToken: String
	}

	type Mutation {
		login(with: LoginTypes!): User!
		requestPasswordReset(email: String!) Boolean 
	}
`;
