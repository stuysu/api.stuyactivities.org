const { gql } = require('apollo-server-express');

module.exports = gql`
	type Membership {
		user: User
		role: String
		updatedAt: String
		createdAt: String
	}
`;
