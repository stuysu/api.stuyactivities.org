import { gql } from 'apollo-server-express';

// TODO REPLACE THE OTHER MESSAGE FORMATS TO BE CONSISTENT WITH THIS
export default gql`
	type UpdateApprovalMessage {
		id: Int!
		message: String
		role: String
		seen: Boolean

		user: User
	}
`;
