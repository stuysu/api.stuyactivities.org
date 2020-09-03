import { gql } from 'apollo-server-express';

export default gql`
	type HelpRequestMessage {
		helpRequest: HelpRequest
		user: User
		role: String
		message: String
		createdAt: DateTime
	}
`;
