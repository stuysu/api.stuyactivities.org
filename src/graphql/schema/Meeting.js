import { gql } from 'apollo-server-express';

export default gql`
	type Meeting {
		id: Int!
		title: String
		description: String
		start: String
		end: String
		organization: Organization
	}
`;
