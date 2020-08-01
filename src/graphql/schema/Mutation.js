import { gql } from 'apollo-server-express';

export default gql`
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

		alterCharter(
			# Either the orgUrl or orgId must be provided
			orgUrl: String
			orgId: Int

			# In case the new changes conflict with changes that were already proposed
			force: Boolean = false

			charter: CharterParams!
		): CharterEdit

		approveCharterFields(orgId: Int!, fields: [String!]!): null
		rejectCharterFields(orgId: Int!, fields: [String]!): null
	}
`;
