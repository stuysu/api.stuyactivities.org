const { gql } = require('apollo-server-express');

module.exports = gql`
	type CharterEdit {
		organization: Organization
		submittingUser: User
		reviewer: User
		approved: Boolean

		createdAt: String
		updatedAt: String

		mission: String
		purpose: String
		benefit: String

		appointmentProcedures: String
		uniqueness: String
		meetingSchedule: String
		meetingDays: [String]

		# Number of meetings per month
		meetingFrequency: Int

		commitmentLevel: String

		extra: String

		keywords: [String]
		comments: [CharterEditComment]
	}
`;
