import { gql } from 'apollo-server-express';

export default gql`
	type AdminRole {
		user: User
		email: String!
		role: String!
	}
`;
