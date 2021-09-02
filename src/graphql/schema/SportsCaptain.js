import { gql } from 'apollo-server-express';

export default gql`
	type SportsCaptain {
		id: Int!
		user: User
		sport: Sport
	}
`;
