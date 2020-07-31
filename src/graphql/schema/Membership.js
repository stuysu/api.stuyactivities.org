import { gql } from 'apollo-server-express';

export default gql`
	type Membership {
		user: User
		role: String
		adminPrivileges: Boolean
		updatedAt: String
		createdAt: String
	}
`;
