const { gql } = require('apollo-server-express');
module.exports = gql`
	input UserParams {
		id: Int
		email: String
	}

	type Query {
		user(with: UserParams!): User
		signedInUser: User
		resetTokenIsValid(token: String!): Boolean!
		organizations: [Organization]!
	}
`;
