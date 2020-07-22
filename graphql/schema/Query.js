const { gql } = require('apollo-server-express');
module.exports = gql`
	input meetingFrequencyParams {
		min: Int! = 1
		max: Int! = 20
	}

	input OrganizationParams {
		keyword: String! = ""
		tags: [String]
		commitmentLevels: [String]
		meetingDays: [String]
		meetingFrequency: meetingFrequencyParams! = { min: 1, max: 20 }
	}

	type Query {
		user(email: String, id: Int): User
		signedInUser: User
		resetTokenIsValid(token: String!): Boolean!
		organizations(
			with: OrganizationParams = {}
			limit: Int = 50
			offset: Int = 0
		): [Organization]!
	}
`;
