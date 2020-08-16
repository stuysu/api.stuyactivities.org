import { gql } from 'apollo-server-express';

export default gql`
	type Strikes {
		organizationId: Int
		weight: Int
		reviewerId: Int
		reason: String
	}
`;
