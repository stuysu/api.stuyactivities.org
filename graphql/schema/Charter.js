const { gql } = require('apollo-server-express');

module.exports = gql`
	type Charter {
		organization: Organization
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
	}
`;
