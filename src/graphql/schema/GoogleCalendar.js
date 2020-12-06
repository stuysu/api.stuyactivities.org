import { gql } from 'apollo-server-express';

export default gql`
	type GoogleCalendar {
		id: Int!
		calendarId: String
		joinUrl: String
	}
`;
