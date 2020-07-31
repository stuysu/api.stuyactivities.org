const { gql } = require('apollo-server-express');

module.exports = gql`
	type Charter {
		picture: String
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

		keywords: [String]
		extra: String
	}
`;