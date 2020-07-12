const { gql } = require('apollo-server-express');
module.exports = gql`
	input UserSearch {
		id: Int
		email: String
	}

	type Query {
		user(where: UserSearch!): User
	}
`;
