import { gql } from 'apollo-server-express';

export default gql`
	type CharterEdit {
		id: Int
		organization: Organization
		picture: CloudinaryResource
		submittingUser: User
		reviewer: User
		status: String
		createdAt: DateTime
		updatedAt: DateTime
		mission: String
		purpose: String
		benefit: String
		appointmentProcedures: String
		uniqueness: String
		meetingSchedule: String
		meetingDays: [String]
		returningInfo: String
		commitmentLevel: String
		extra: String
		alteredFields: [String]
		keywords: [String]
		socials: String
	}
`;
