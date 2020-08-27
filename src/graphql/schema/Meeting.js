import { gql } from 'apollo-server-express';

export default gql`
	type Meeting {
		organization: Organization
		id: Int!
		title: String
		description: String
		start: String
		end: String
	}
`;
