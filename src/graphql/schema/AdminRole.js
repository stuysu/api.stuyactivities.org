import { gql } from 'apollo-server-express';

export default gql`
	type AdminRole {
		id: Int!
		user: User
		role: String!
	}
`;
