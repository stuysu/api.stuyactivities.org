import { gql } from 'apollo-server-express';

export default gql`
	type HelpRequest {
		id: Int!
		email: String
		title: String
		description: String
		captchaToken: String
		honeybadgerId: String
		path: String
		status: String
		ipAddress: String
		createdAt: String

		user: User
		messages: [HelpRequestMessage]
	}
`;
