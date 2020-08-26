import { gql } from 'apollo-server-express';

export default gql`
	type MembershipRequest {
		user: User
		organization: Organization
		role: String
		adminPrivileges: Boolean
		userMessage: String
		adminMessage: String
		userApproval: Boolean
		adminApproval: Boolean
		createdAt: String
		updatedAt: String
	}
`;
