const { gql } = require('apollo-server-express');

module.exports = gql`
	type CharterEdit {
		id: Int
		organization: Organization
		picture: String
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

		alteredFields: [String]

		keywords: [String]
		comments: [CharterEditComment]
	}
`;