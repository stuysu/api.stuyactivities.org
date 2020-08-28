import { gql } from 'apollo-server-express';

export default gql`
	type Membership {
		id: Int!
		user: User
		organization: Organization
		role: String
		adminPrivileges: Boolean
		updatedAt: String
		createdAt: String
	}
`;
