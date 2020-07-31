import { gql } from 'apollo-server-express';

export default gql`
	type CharterEditComment {
		id: Int
		user: User
		comment: String
	}
`;
