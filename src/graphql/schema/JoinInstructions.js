import { gql } from 'apollo-server-express';

export default gql`
	type JoinInstructions {
		id: Int!
		organization: Organization!
		instructions: String
		buttonEnabled: Boolean
	}
`;
