import { gql } from 'apollo-server-express';

export default gql`
	type Group {
		id: Int!
		name: String
		organization: Organization
		memberships: [GroupMembership!]
	}
`;
