import { gql } from 'apollo-server-express';

export default gql`
	type Organization {
		id: Int
		name: String!
		url: String!
		active: Boolean!
		createdAt: String!
		tags: [Tag]!
		charter: Charter

		memberships(onlyLeaders: Boolean = false): [Membership]
		charterEdits: [CharterEdit]!
	}
`;
