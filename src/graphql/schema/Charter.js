import { gql } from 'apollo-server-express';

export default gql`
	type Charter {
		id: Int!
		organization: Organization
		picture: CloudinaryResource
		mission: String
		purpose: String
		benefit: String
		socials: String

		appointmentProcedures: String
		uniqueness: String
		meetingSchedule: String
		meetingDays: [String]
		returningInfo: String

		commitmentLevel: String

		keywords: [String]
		extra: String
		updatedAt: DateTime
		clubpubParticipant: Boolean
	}
`;
