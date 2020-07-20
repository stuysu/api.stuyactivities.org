const { gql } = require('apollo-server-express');
module.exports = gql`
	input UserParams {
		id: Int
		email: String
	}

	input OrganizationParams {
		keyword: String
		tags: [String]
		commitmentLevels: [String]
	}

	type Query {
		user(with: UserParams!): User
		signedInUser: User
		resetTokenIsValid(token: String!): Boolean!
		organizations(
			with: OrganizationParams
			limit: Int = 50
			offset: Int = 0
		): [Organization]!
	}
`;
