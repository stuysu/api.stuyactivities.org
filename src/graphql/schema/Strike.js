import { gql } from 'apollo-server-express';

export default gql`
	type Strikes {
		organization: Organization
		organizationId: Int
		weight: Int
		reviewer: [String]
		reviewerId: Int
		reason: String
	}
`;
