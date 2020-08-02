import { gql } from 'apollo-server-express';

export default gql`
	type AdminRole {
		user: User
		role: String!
	}
`;
