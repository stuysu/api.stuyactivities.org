import { gql } from 'apollo-server-express';

export default gql`
	type CharterApprovalMessage {
		id: Int!
		organization: Organization
		user: User
		message: String
		auto: Boolean
		seen: Boolean
	}
`;
