import { gql } from 'apollo-server-express';

export default gql`
	type Charter {
		organization: Organization
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
