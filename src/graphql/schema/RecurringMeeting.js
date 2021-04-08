import { gql } from 'apollo-server-express';

export default gql`
	type RecurringMeeting {
		id: Int!
		organization: Organization
		dayOfWeek: Int!
		frequency: Int!
		start: DateTime
		end: DateTime
		title: String
		description: String
		privacy: String
	}
`;
