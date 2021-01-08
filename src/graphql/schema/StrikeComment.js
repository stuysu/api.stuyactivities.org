import { gql } from 'apollo-server-express';

export default gql`
	type StrikeComment {
		id: Int!
		strike: Strike
		user: User
		message: String
		auto: Boolean
		seen: Boolean
		createdAt: DateTime
	}
`;
