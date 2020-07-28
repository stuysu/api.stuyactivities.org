const { gql } = require('apollo-server-express');

module.exports = gql`
	type Membership {
		user: User
		role: String
		adminPrivileges: Boolean
		updatedAt: String
		createdAt: String
	}
`;
