const { gql } = require('apollo-server-express');

module.exports = gql`
	input StdLoginParams {
		email: String!
		password: String!
	}

	input LoginTypes {
		where: StdLoginParams
		googleOAuthToken: String
	}

	type Mutation {
		login(where: LoginTypes): User!
	}
`;
