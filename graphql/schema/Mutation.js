const { gql } = require('apollo-server-express');

module.exports = gql`
	input StdLoginParams {
		email: String!
		password: String!
	}

	input CharterParams {
		mission: String
		purpose: String
		benefit: String
		appointmentProcedures: String
		uniqueness: String
		meetingSchedule: String
		meetingDays: [String!]
		# Number of meetings per month
		meetingFrequency: Int
		commitmentLevel: String
		keywords: [String!]
		extra: String
		picture: Upload
	}

	type Mutation {
		login(credentials: StdLoginParams, googleToken: String): User!
		logout: Boolean
		requestPasswordReset(email: String!): Boolean
		usePasswordResetToken(token: String!, password: String!): Boolean
		createOrganization(
			name: String!
			url: String!
			charter: CharterParams!
			tags: [Int!]!
			# String of emails
			leaders: [Int!]!
		): Organization
	}
`;
