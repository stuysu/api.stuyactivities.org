import { gql } from 'apollo-server-express';

export default gql`
	type StrikeComment {
		id: Int!
		organization: Organization
		strike: Strike
		user: User
		message: String
		auto: Boolean
		seen: Boolean
		createdAt: DateTime
	}
`;
