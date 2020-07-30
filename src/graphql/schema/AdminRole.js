const { gql } = require('apollo-server-express');

module.exports = gql`
	type AdminRole {
		user: User
		email: String!
		role: String!
	}
`;
