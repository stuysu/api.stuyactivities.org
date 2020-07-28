const { gql } = require('apollo-server-express');
module.exports = gql`
	input meetingFrequencyParams {
		min: Int! = 1
		max: Int! = 20
	}

	type Query {
		user(email: String, id: Int): User
		authenticatedUser: User
		resetTokenIsValid(token: String!): Boolean!
		organizations(
			keyword: String
			tags: [String]
			commitmentLevels: [String]
			meetingDays: [String]
			meetingFrequency: meetingFrequencyParams
			limit: Int! = 50
			offset: Int! = 0
		): [Organization]!
		organization(url: String, id: String): Organization
		charter(orgUrl: String, orgId: Int): Charter
		members(orgUrl: String, orgId: Int): [Membership]

		tags(keyword: String): [Tag]!
	}
`;
