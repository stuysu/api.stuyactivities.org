import { gql } from 'apollo-server-express';

export default gql`
	type Tag {
		id: Int
		name: String!
		description: String
	}
`;
