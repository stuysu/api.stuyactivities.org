import { gql } from 'apollo-server-express';

export default gql`
	type UpdateQuestion {
		id: Int!
		updateId: Int
		submittingUserId: Int
		question: String!
		answer: String
		private: Boolean!

		submittingUser: User
		update: Update
	}
`;
