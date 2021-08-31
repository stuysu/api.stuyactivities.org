import { gql } from 'apollo-server-express';

export default gql`
	type Meeting {
		id: Int!
		title: String
		description: String
		start: DateTime
		end: DateTime
		privacy: String
		organization: Organization
		group: Group,
		rooms: [Room!]!
	}
`;
