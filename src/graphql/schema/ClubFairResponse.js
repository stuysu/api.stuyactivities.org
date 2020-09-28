import { gql } from 'apollo-server-express';

export default gql`
	type ClubFairResponse {
		id: Int!
		organizationId: Int
		isAttending: Boolean
		meetingDay: DateTime
		meetingLink: String
	}
`;
