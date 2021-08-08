import { gql } from 'apollo-server-express';

export default gql`
	type GroupMembership {
		id: Int!
		user: User
		group: Group
	}
`;
